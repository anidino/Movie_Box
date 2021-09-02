// ani
const axios = require("axios").default;
const router = require("express").Router();
const aniKey = "43934c9963msh721330f251ef6dep1dc772jsn1442ece51420";

const withAuth = require("../../utils/auth");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { User, Movie, UserFav, UserReview, Rating } = require("../../models");



router.get("/singleMovie/:id", (req, res) => {
  Movie.findOne({
    where: {
      id: req.params.id,
    },
    //     include: [
    //       {
    //         model: UserReview,
    //         attributes: ["id", "title", "post_content", "movie_id", "user_id"],
    //         include: {
    //           model: User,
    //           attributes: ["id", "username"],
    //         },
    //       },
    //     ],
  })
    .then((dbData) => {
      res.json(dbData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Ani's get movie by title // this will be used to display the single view page // the other /search/:title returns all matching search params on the index page
router.get("/title/:title", (req, res) => {
  let title = req.params.title.split("_").join(" ");
  console.log("LOOK HERE", title);

  Movie.findOne({
    where: {
      title: title,
    },
    include: [
      {
        model: UserReview,
        attributes: ["id", "title", "post_content", "user_id"],
        include: {
          model: User,
          attributes: ["id", "username"],
        },
      },
    ],
  })
    .then((dbMovieData) => {
      if (!dbMovieData) {
        res
          .status(404)
          .json({ message: "We can't find a movie called this. 🙁" });
        return;
      }
      res.json(dbMovieData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


//Ani's routes - get movie by id for LOGGED IN USERS ////
router.get("/:id", withAuth, (req, res) => {
  Movie.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: UserReview,
        attributes: ["id", "title", "post_content", "movie_id", "user_id"],
        include: {
          model: User,
          attributes: ["id", "username"],
        }
      },
    ],
  })
    .then((dbData) => {
      console.log(dbData);
      res.json(dbData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Ani's get movie by title for LOGGED IN users //
router.get("/title/:title", withAuth, (req, res) => {
  let title = req.params.title.split("_").join(" ");
  console.log("LOOK HERE", title);

  Movie.findOne({
    where: {
      title: title,
    },
    include: [
      {
        model: UserReview,
        attributes: ["id", "title", "post_content", "user_id"],
        // include: {
        //   model: User,
        //   attributes: ["id", "username"],
        // },
      },
    ],
  })
    .then((dbMovieData) => {
      if (!dbMovieData) {
        res
          .status(404)
          .json({ message: "We can't find a movie called this. 🙁" });
        return;
      }
      res.json(dbMovieData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


// Ani's delete movie route //
// a user movie can be deleted although we likely won't use this
//tested on movie id 0 and got wanted response. (404 message below bc no movie 0)
router.delete("/delete/:id", (req, res) => {
  Movie.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbMovieData) => {
      if (!dbMovieData) {
        res
          .status(404)
          .json({ message: "No movie found with this id for us to delete" });
        return;
      }
      res.json(dbMovieData);
      console.log("movie deleted successfully");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});





module.exports = router;
