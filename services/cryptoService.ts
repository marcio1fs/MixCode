

if (!process.env.MIXSYNC_KEY) {
  throw new Error("MIXSYNC_KEY environment variable not set. Please provide a 32-byte base64 encoded key.");
}

const MIXSYNC_KEY_B64 = process.env.MIXSYNC_KEY;
let cryptoKey: CryptoKey;

// Helper to convert Base64 string to Uint8Array
function base64ToUint8Array(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// Helper to convert Uint8Array to Base64 string
function uint8ArrayToBase64(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

async function getKey(): Promise<CryptoKey> {
    if (cryptoKey) return cryptoKey;

    const keyBytes = base64ToUint8Array(MIXSYNC_KEY_B64);
    if (keyBytes.length !== 32) {
        throw new Error("MIXSYNC_KEY must be a 32-byte (256-bit) key.");
    }

    cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM', length: 256 },
        false, // not extractable
        ['encrypt', 'decrypt']
    );
    return cryptoKey;
}

/**
 * Encrypts a plaintext string using AES-GCM.
 * @param plaintext The string to encrypt.
 * @returns A base64 encoded string containing the IV and the ciphertext.
 */
export async function encrypt(plaintext: string): Promise<string> {
    if (plaintext === null || plaintext === undefined) return '';
    try {
        const key = await getKey();
        const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
        const encoded = new TextEncoder().encode(plaintext);

        const ciphertext = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            encoded
        );

        const combined = new Uint8Array(iv.length + ciphertext.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(ciphertext), iv.length);

        return uint8ArrayToBase64(combined);
    } catch(e) {
        console.error("Encryption failed", e);
        return plaintext; // Fallback to plaintext if encryption fails
    }
}

/**
 * Decrypts a base64 encoded ciphertext string using AES-GCM.
 * @param base64Ciphertext The base64 string (IV + ciphertext) to decrypt.
 * @returns The decrypted plaintext string.
 */
export async function decrypt(base64Ciphertext: string): Promise<string> {
    if (!base64Ciphertext) return '';
    try {
        const key = await getKey();
        const combined = base64ToUint8Array(base64Ciphertext);
        
        // IV is 12 bytes
        if (combined.length < 12) {
             throw new Error("Invalid encrypted data: length is less than IV size.");
        }

        const iv = combined.slice(0, 12);
        const ciphertext = combined.slice(12);
        
        if (ciphertext.byteLength === 0) return '';

        const decrypted = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            ciphertext
        );

        return new TextDecoder().decode(decrypted);
    } catch (e) {
        // This can happen if the content is not encrypted (e.g., old projects, or user manually changed it)
        // console.warn("Decryption failed, returning raw content:", e);
        return base64Ciphertext;
    }
}

/**
 * Checks if a given file path is inside the .mixsync directory.
 */
export const isMixSyncPath = (path: string): boolean => {
    return path.includes('/.mixsync/');
};