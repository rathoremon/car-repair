const crypto = require("crypto");
const { Document } = require("../models");

exports.createDocument = async ({ userId, providerId, file, type }) => {
  // Calculate SHA256 checksum
  const checksum = await new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = require("fs").createReadStream(file.path);
    stream.on("data", (data) => hash.update(data));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });

  // Prevent duplicate uploads by checksum per user
  const exists = await Document.findOne({ where: { userId, checksum } });
  if (exists) throw new Error("Duplicate document upload");

  return Document.create({
    userId,
    providerId,
    filePath: file.path.replace(/\\/g, "/"),
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    checksum,
    type,
    status: "pending",
  });
};

exports.getDocuments = async ({ userId, providerId }) => {
  return Document.findAll({
    where: { userId, providerId },
    order: [["uploadedAt", "DESC"]],
  });
};

exports.updateStatus = async (id, status) => {
  const doc = await Document.findByPk(id);
  if (!doc) throw new Error("Document not found");
  doc.status = status;
  await doc.save();
  return doc;
};
