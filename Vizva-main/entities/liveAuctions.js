import Artwork1 from "public/artworks/artwork 1.png";
import Artwork2 from "public/artworks/artwork 2.png";
import Artwork3 from "public/artworks/artwork 3.png";
import Artwork4 from "public/artworks/artwork 4.png";
import Artwork5 from "public/artworks/artwork 5.png";
import Artwork6 from "public/artworks/artwork 6.png";
import Artwork7 from "public/artworks/artwork 7.png";
import Artwork8 from "public/artworks/artwork 8.png";

// artists
import Artist1 from "public/artists/artist 1.png";
import Artist2 from "public/artists/artist 2.png";
import Artist3 from "public/artists/artist 3.png";
import Artist4 from "public/artists/artist 4.png";
export const liveAuctions = [
  {
    image: Artwork1,
    name: "guilty pleasure",
    creator: {
      name: "artist name",
      profileImage: Artist1,
    },
    currentBid: "1.00",
    currency: "ethereum",
    time: Date.now() + 60 * 60,
    format: ".jpg",
    size: {
      width: 1200,
      height: 1200,
    },
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi commodi assumenda distinctio, sed ducimus natus nam tempore quia quaerat asperiores quibusdam a, perspiciatis illum labore deserunt tempora excepturi, fugit voluptas!",
    tags: [
      "3d",
      "algorithmic",
      "digitalart",
      "geometrics",
      "render",
      "sci-fi",
      "surreal",
      "visionaryart",
    ],
    history: [
      {
        name: "alex henry",
        amountBid: "1.00",
        currency: "ethereum",
        time: Date.now() - 60 * 60 * 8,
        type: "bid",
      },
      {
        name: "ultimus maximus",
        amountBid: "1.00",
        currency: "ethereum",
        time: Date.now() - 60 * 60 * 60 * 60,
        type: "bid",
      },
      {
        name: "artist name",
        amount: "1.00",
        currency: "ethereum",
        time: Date.now() - 60 * 60 * 8,
        type: "listed",
      },
      {
        name: "artist name",
        amount: "",
        time: Date.now() - 60 * 60 * 8,
        type: "minted",
      },
    ],
  },
  {
    image: Artwork7,
    name: "day dreaming",
    creator: {
      name: "artist name",
      profileImage: Artist2,
    },
    currentBid: "1.20",
    currency: "dogecoin",
    time: Date.now() + 60 * 60 * 24,
    format: ".jpg",
    size: {
      width: 1200,
      height: 1200,
    },
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi commodi assumenda distinctio, sed ducimus natus nam tempore quia quaerat asperiores quibusdam a, perspiciatis illum labore deserunt tempora excepturi, fugit voluptas!",
    tags: [
      "3d",
      "algorithmic",
      "digitalart",
      "geometrics",
      "render",
      "sci-fi",
      "surreal",
      "visionaryart",
    ],
    history: [
      {
        name: "alex henry",
        amountBid: "1.00",
        currency: "ethereum",
        time: Date.now() - 60 * 60 * 8,
        type: "bid",
      },
      {
        name: "artist name",
        amount: "",
        time: Date.now() - 60 * 60 * 8,
        type: "listed",
      },
      {
        name: "artist name",
        amount: "",
        time: Date.now() - 60 * 60 * 8,
        type: "minted",
      },
    ],
  },
  {
    image: Artwork8,
    name: "city parts",
    creator: {
      name: "artist name",
      profileImage: Artist3,
    },
    currentBid: "0.90",
    currency: "ethereum",
    time: Date.now() + 60 * 40,
    format: ".jpg",
    size: {
      width: 1200,
      height: 1200,
    },
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi commodi assumenda distinctio, sed ducimus natus nam tempore quia quaerat asperiores quibusdam a, perspiciatis illum labore deserunt tempora excepturi, fugit voluptas!",
    tags: [
      "3d",
      "algorithmic",
      "digitalart",
      "geometrics",
      "render",
      "sci-fi",
      "surreal",
      "visionaryart",
    ],
    history: [
      {
        name: "alex henry",
        amountBid: "1.00",
        currency: "ethereum",
        time: Date.now() - 60 * 60 * 8,
        type: "bid",
      },
      {
        name: "artist name",
        amount: "",
        time: Date.now() - 60 * 60 * 8,
        type: "listed",
      },
      {
        name: "artist name",
        amount: "",
        time: Date.now() - 60 * 60 * 8,
        type: "minted",
      },
    ],
  },
  {
    image: Artwork4,
    name: "everyone wants cats",
    creator: {
      name: "artist name",
      profileImage: Artist4,
    },
    currentBid: "1.00",
    currency: "bitcoin",
    time: Date.now() + 60 * 30,
    format: ".jpg",
    size: {
      width: 1200,
      height: 1200,
    },
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi commodi assumenda distinctio, sed ducimus natus nam tempore quia quaerat asperiores quibusdam a, perspiciatis illum labore deserunt tempora excepturi, fugit voluptas!",
    tags: [
      "3d",
      "algorithmic",
      "digitalart",
      "geometrics",
      "render",
      "sci-fi",
      "surreal",
      "visionaryart",
    ],
    history: [
      {
        name: "alex henry",
        amountBid: "1.00",
        currency: "ethereum",
        time: Date.now() - 60 * 60 * 8,
        type: "bid",
      },
      {
        name: "artist name",
        amount: "",
        time: Date.now() - 60 * 60 * 8,
        type: "listed",
      },
      {
        name: "artist name",
        amount: "",
        time: Date.now() - 60 * 60 * 8,
        type: "minted",
      },
    ],
  },
  {
    image: Artwork6,
    name: "far from life",
    creator: {
      name: "artist name",
      profileImage: Artist1,
    },
    currentBid: "1.03",
    currency: "ethereum",
    time: Date.now() + 60 * 60 * 6,
    format: ".jpg",
    size: {
      width: 1200,
      height: 1200,
    },
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi commodi assumenda distinctio, sed ducimus natus nam tempore quia quaerat asperiores quibusdam a, perspiciatis illum labore deserunt tempora excepturi, fugit voluptas!",
    tags: [
      "3d",
      "algorithmic",
      "digitalart",
      "geometrics",
      "render",
      "sci-fi",
      "surreal",
      "visionaryart",
    ],
    history: [
      {
        name: "alex henry",
        amountBid: "1.00",
        currency: "ethereum",
        time: Date.now() - 60 * 60 * 8,
        type: "bid",
      },
      {
        name: "artist name",
        amount: "",
        time: Date.now() - 60 * 60 * 8,
        type: "listed",
      },
      {
        name: "artist name",
        amount: "",
        time: Date.now() - 60 * 60 * 8,
        type: "minted",
      },
    ],
  },
];
