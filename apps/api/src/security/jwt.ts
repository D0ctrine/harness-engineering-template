interface JwtHeader {
  alg: "HS256";
  typ: "JWT";
}

interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}

interface VerifiableJwtPayload {
  exp?: number;
}

const textEncoder = new TextEncoder();

const toBase64Url = (bytes: Uint8Array) => {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
};

const fromBase64Url = (value: string) => {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
};

const encodeJson = (value: unknown) => toBase64Url(textEncoder.encode(JSON.stringify(value)));

const importKey = (secret: string) =>
  crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256"
    },
    false,
    ["sign"]
  );

const sign = async (value: string, secret: string) => {
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(value));

  return toBase64Url(new Uint8Array(signature));
};

const timingSafeEqual = (first: string, second: string) => {
  const firstBytes = textEncoder.encode(first);
  const secondBytes = textEncoder.encode(second);

  if (firstBytes.length !== secondBytes.length) {
    return false;
  }

  let diff = 0;

  for (let index = 0; index < firstBytes.length; index += 1) {
    diff |= firstBytes[index] ^ secondBytes[index];
  }

  return diff === 0;
};

export const signJwt = async (payload: JwtPayload, secret: string) => {
  const header: JwtHeader = {
    alg: "HS256",
    typ: "JWT"
  };
  const signingInput = `${encodeJson(header)}.${encodeJson(payload)}`;
  const signature = await sign(signingInput, secret);

  return `${signingInput}.${signature}`;
};

export const verifyJwt = async <Payload extends VerifiableJwtPayload>(
  token: string,
  secret: string
): Promise<Payload | null> => {
  const [encodedHeader, encodedPayload, signature] = token.split(".");

  if (!encodedHeader || !encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = await sign(`${encodedHeader}.${encodedPayload}`, secret);

  if (!timingSafeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const header = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedHeader))) as JwtHeader;

    if (header.alg !== "HS256" || header.typ !== "JWT") {
      return null;
    }
  } catch {
    return null;
  }

  let payload: Payload;

  try {
    payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedPayload))) as Payload;
  } catch {
    return null;
  }

  if (typeof payload.exp === "number" && payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
};
