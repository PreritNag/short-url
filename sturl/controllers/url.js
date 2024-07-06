const shortid= require("shortid");

const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ error: "url is required" });
  }
  const shortID = shortid.generate();
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitedHistory:[],
  });
  return res.status(201).json({ shortId: shortID });
}

module.exports = { handleGenerateNewShortURL };