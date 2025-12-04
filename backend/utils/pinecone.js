import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
dotenv.config();

/**
 * ✅ Initialize Pinecone client
 */
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

/**
 * ✅ Define the index name
 * Make sure this matches exactly what you see in your Pinecone dashboard
 */
const indexName = process.env.PINECONE_INDEX || "chatbot"; // 👈 update to your real index name

/**
 * ✅ Get Pinecone index instance
 */
export const getIndex = () => pinecone.index(indexName);

/**
 * ✅ Store vectors inside user-specific namespace
 * @param {Array} vectors - [{ id, values, metadata }]
 * @param {String} userId - MongoDB _id (used as namespace)
 */
export const upsertVectors = async (vectors, userId) => {
  try {
    const index = getIndex();
    const namespace = userId.toString();

    await index.upsert({
      vectors,
      namespace,
    });

    console.log(`✅ Stored ${vectors.length} vectors in namespace: ${namespace}`);
  } catch (err) {
    console.error("❌ Pinecone upsert error:", err.message);
  }
};

/**
 * ✅ Query vectors for a specific user
 * @param {Array} queryEmbedding - the query embedding (float array)
 * @param {String} userId - user's namespace
 * @param {Number} topK - number of matches
 */
export const queryVectors = async (queryEmbedding, userId, topK = 5) => {
  try {
    const index = getIndex();
    const namespace = userId.toString();

    const response = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      namespace,
    });

    console.log(
      `🔍 Queried Pinecone (ns: ${namespace}) — found ${response.matches?.length || 0} matches`
    );

    return response.matches || [];
  } catch (err) {
    console.error("❌ Pinecone query error:", err.message);
    return [];
  }
};

/**
 * ✅ Delete all data for a given user (optional cleanup)
 */
export const deleteUserNamespace = async (userId) => {
  try {
    const index = getIndex();
    await index.deleteAll({ namespace: userId.toString() });

    console.log(`🧹 Cleared Pinecone namespace: ${userId}`);
  } catch (err) {
    console.error("❌ Pinecone delete namespace error:", err.message);
  }
};


export const deleteVectorsByPage = async (userId, pageUrl) => {
  try {
    const index = getIndex();
    await index.deleteMany({
      namespace: userId,
      filter: { page: pageUrl }  // ⚠ metadata.page match
    });
    console.log(`🗑 Deleted old vectors for page: ${pageUrl}`);
  } catch (err) {
    console.log("Delete by page error →", err.message);
  }
};

