const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");
const User = require("../models/userModel");

async function createRepository(req, res) {
  const { owner, name, issues, content, description, visibility } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name is required!" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid User ID!" });
    }

    const newRepository = new Repository({
      name,
      description,
      visibility,
      owner,
      content,
      issues,
    });

    const result = await newRepository.save();

    res
      .status(201)
      .json({ message: "Repository created!", repositoryID: result._id });
  } catch (err) {
    console.error("Error during repository creation : ", err.message);
    res.status(500).send("Server error");
  }
}

async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");
    res.json(repositories);
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).send("Server error");
  }
}

async function fetchRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findById(id)
      .populate("owner")
      .populate("issues");
    if (!repository) {
      return res.status(404).send("Repository not found");
    }
    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository: ", err.message);
    res.status(500).send("Server error");
  }
}

async function fetchRepositoryName(req, res) {
  const { name } = req.params;
  try {
    const repository = await Repository.find({ name })
      .populate("owner")
      .populate("issues");
    if (!repository) {
      return res.status(404).send("Repository not found");
    }
    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository: ", err.message);
    res.status(500).send("Server error");
  }
}

// Below callback will only access after user is logged in!
async function fetchRepositoriesForCurrentUser(req, res) {
  const { userID } = req.params;

  try {
    const repositories = await Repository.find({ owner: userID });

    if (!repositories || repositories.length == 0) {
      return res.status(404).json({ error: "User Repositories not found!" });
    }
    console.log(repositories);
    res.json({ message: "Repositories found!", repositories });
  } catch (err) {
    console.error("Error during fetching user repositories : ", err.message);
    res.status(500).send("Server error");
  }
}
async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { content, description } = req.body;

  try {
    const repository = await Repository.find(id);
    if (!repository) {
      return res.status(404).josn({ error: "Repository not found!" });
    }

    repository.content.push(content);
    respository.description = description;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository updated successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during updating user repository: ", err.message);
    res.status(500).send("Server error");
  }
}

async function toggleVisibilityById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.find(id);
    if (!repository) {
      return res.status(404).josn({ error: "Repository not found!" });
    }

    repository.visibility = !repository.visibility;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository visibility toggled successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during updating user repository: ", err.message);
    res.status(500).send("Server error");
  }
}

async function deleteRepositoryById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findByIdAndDelete(id);

    if (!repository) {
      return res.status(404).josn({ error: "Repository not found!" });
    }

    res.json({ message: "Repository deleted successfully!" });
  } catch (err) {
    console.error("Error during deleting user repository: ", err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
};
