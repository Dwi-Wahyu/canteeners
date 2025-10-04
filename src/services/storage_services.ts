import { writeFileSync, existsSync, mkdirSync, chmodSync } from "fs";
import { join, extname } from "path";
import { v4 as uuidv4 } from "uuid";

export interface StorageService {
  uploadImage(file: File, username: string, subfolder: string): Promise<string>;
}

const UPLOAD_BASE_DIR = "public/uploads";
const AVATAR_DIR = "avatar";

function sanitizeFileNamePart(input: string): string {
  return input.replace(/[/\\:*?"<>|]/g, "_");
}

function ensureDirExists(dirPath: string) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

export class LocalStorageService implements StorageService {
  constructor() {
    ensureDirExists(join(process.cwd(), UPLOAD_BASE_DIR, AVATAR_DIR));
  }

  /**
   * Mengunggah gambar avatar ke penyimpanan lokal di server.
   *
   * @param file Objek File yang diunggah.
   * @param filename Filename yang terkait dengan gambar (digunakan untuk penamaan file).
   * @param subfolder Subfolder yang terkait dengan gambar (digunakan untuk tempat menyimpan file).
   * @returns Promise yang resolve dengan URL relatif avatar yang diunggah, atau reject dengan error.
   */
  public async uploadImage(
    file: File,
    filename: string,
    subfolder: string
  ): Promise<string> {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg"];
    const fileExtension = extname(file.name).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error(`Format gambar tidak didukung: ${fileExtension}`);
    }

    const sanitizedIdentifier = sanitizeFileNamePart(filename);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const uniqueFileName = `${sanitizedIdentifier}_${timestamp}_${uuidv4()}${fileExtension}`;

    const targetDir = join(process.cwd(), UPLOAD_BASE_DIR, subfolder);
    ensureDirExists(targetDir);

    const absolutePath = join(targetDir, uniqueFileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      writeFileSync(absolutePath, buffer);
      chmodSync(absolutePath, 0o644);
      console.log(`File berhasil disimpan di: ${absolutePath}`);
    } catch (error: any) {
      console.error("Gagal menulis file:", error);
      throw new Error(`Gagal menyimpan gambar: ${error.message}`);
    }

    const relativeUrlPath = `/${UPLOAD_BASE_DIR.split("/")
      .slice(1)
      .join("/")}/${subfolder}/${uniqueFileName}`;
    return relativeUrlPath;
  }

  /**
   * Mengunggah file media (gambar atau video) ke penyimpanan lokal di server.
   *
   * @param file Objek File yang diunggah.
   * @param filename Identifier unik untuk file (misalnya ID berita atau judul berita yang disanitasi).
   * @param subfolder Subfolder di dalam UPLOAD_BASE_DIR tempat menyimpan file (misalnya 'berita').
   * @returns Promise yang resolve dengan URL relatif media yang diunggah, atau reject dengan error.
   */
  public async uploadMedia(
    file: File,
    filename: string,
    subfolder: string
  ): Promise<string> {
    const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg"];
    const allowedVideoExtensions = [".mp4", ".avi", ".mov", ".webm", ".mkv"];
    const allowedExtensions = [
      ...allowedImageExtensions,
      ...allowedVideoExtensions,
    ];

    const fileExtension = extname(file.name).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error(
        `Format media tidak didukung: ${fileExtension}. Hanya gambar (${allowedImageExtensions.join(
          ", "
        )}) dan video (${allowedVideoExtensions.join(", ")}) yang diizinkan.`
      );
    }

    const sanitizedIdentifier = sanitizeFileNamePart(filename);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const uniqueFileName = `${sanitizedIdentifier}_${timestamp}_${uuidv4()}${fileExtension}`;

    const targetDir = join(process.cwd(), UPLOAD_BASE_DIR, subfolder);
    ensureDirExists(targetDir);

    const absolutePath = join(targetDir, uniqueFileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      writeFileSync(absolutePath, buffer);
      console.log(`File media berhasil disimpan di: ${absolutePath}`);
    } catch (error: any) {
      console.error("Gagal menulis file media:", error);
      throw new Error(`Gagal menyimpan media: ${error.message}`);
    }

    const relativeUrlPath = `/${UPLOAD_BASE_DIR.split("/")
      .slice(1)
      .join("/")}/${subfolder}/${uniqueFileName}`;
    return relativeUrlPath;
  }
}
