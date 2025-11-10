import { Client } from "@elastic/elasticsearch";

const ELASTICSEARCH_URL =
  process.env.ELASTICSEARCH_URL || "http://localhost:9200";

let esClient = null;

export const connectElasticsearch = async () => {
  if (esClient) {
    console.log("Elasticsearch client already initialized.");
    return esClient;
  }

  try {
    console.log(`Connecting to Elasticsearch at ${ELASTICSEARCH_URL}...`);

    esClient = new Client({
      node: ELASTICSEARCH_URL,
    });

    // Test the connection
    await esClient.info();
    console.log("✅ Elasticsearch connection successful.");

    return esClient;
  } catch (error) {
    console.error("❌ Failed to connect to Elasticsearch:", error.message);
    // Throwing the error here will allow the main server file to catch and halt startup.
    throw error;
  }
};

export const getElasticsearchClient = () => {
  if (!esClient) {
    throw new Error(
      "Elasticsearch client not established. Call connectElasticsearch first."
    );
  }
  return esClient;
};

/**
 * Closes the Elasticsearch client connection.
 */
export const closeElasticsearch = async () => {
  if (esClient) {
    await esClient.close();
    esClient = null;
    console.log("Elasticsearch client closed.");
  }
};
