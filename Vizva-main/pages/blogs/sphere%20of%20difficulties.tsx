import MaxWidth from "components/layout/maxWidth";
import Navbar from "components/navigation/navbar";
import Footer from "components/pages/home/footer";
import Head from "next/head";
import Link from "next/link";
import { StyledBlog } from "./creators%20renaissance";

export default function SphereOfDifficulties() {
  return (
    <>
      <Head>
        <title>NFT Artists: A sphere of difficulties</title>
        <meta
          name="description"
          content="The creators' village is abuzz with NFTs. They're gaining a lot of traction as a place for artists, creators, and investors to produce, find, explore, and collect one-of-a-kind works of art from all over the world, as well as diversify their revenue streams."
        />

        {/* facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://vizva.io/blog/sphere%20of%20difficulties`}
        />
        <meta
          property="og:title"
          content="NFT Artists: A sphere of difficulties"
        />
        <meta
          property="og:image"
          content="https://cdn.discordapp.com/attachments/877089668401889321/967047340257083492/Vizva_Blog_02.jpg"
        />
        <meta
          property="og:description"
          content="The creators' village is abuzz with NFTs. They're gaining a lot of traction as a place for artists, creators, and investors to produce, find, explore, and collect one-of-a-kind works of art from all over the world, as well as diversify their revenue streams."
        />

        {/* twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:title"
          content="NFT Artists: A sphere of difficulties"
        />
        <meta
          property="twitter:image"
          content="https://cdn.discordapp.com/attachments/877089668401889321/967047340257083492/Vizva_Blog_02.jpg"
        />

        {/* change to handle of the owners */}
        <meta property="twitter:site" content="@intovizva" />
        <meta property="twitter:creator" content="@intovizva" />
      </Head>
      <Navbar showSearch={false} />
      <MaxWidth>
        <StyledBlog>
          <img
            src="https://cdn.discordapp.com/attachments/877089668401889321/967047340257083492/Vizva_Blog_02.jpg"
            alt="image"
          />
          <h1>NFT Artists: A sphere of difficulties</h1>
          <div className="meta">
            <p>On Sep 1 2021</p>
            <p>3 Min Read</p>
          </div>

          <p>
            The creators' village is abuzz with NFTs. They're gaining a lot of
            traction as a place for artists, creators, and investors to produce,
            find, explore, and collect one-of-a-kind works of art from all over
            the world, as well as diversify their revenue streams.
          </p>

          <p>
            However, discussing the bulk of the creator pool may cause some
            people to change their minds. The NFT creators are dealing with a
            number of issues, but there is no one to bring them to their
            attention. The only topic of conversation is the fame and money that
            the pool's minority earns.
          </p>

          <p>
            Surprisingly, a Vizva-led movement appears to be paying attention to
            the problems of the majority of NFT creators. Rather than focusing
            on well-known NFT artists, their "Vizva: Voice your vision" campaign
            entails reaching out to any NFT artist via social media and asking
            them about the issues they've encountered in the NFT area.
          </p>

          <p>
            The artists are also given the opportunity to be featured on social
            media for bringing their issues to light. The first two contacts,
            out of a slew of others, showed out to be a common issue for the
            general public.
          </p>

          <blockquote>
            "I believe that newer/smaller artists do not receive the attention
            they need to succeed. Furthermore, on any platform, cultivating a
            community and establishing oneself as a brand takes a long time. Not
            to mention the ever-increasing cost of gas and minting."{" "}
            <em>-Santanu</em>
          </blockquote>

          <blockquote>
            "I've been an NFT member for about 5 months. It's fair to say that
            I'm having some trouble grasping the entire technological circle
            that revolves around blockchain. <em>Pooja</em>
          </blockquote>

          <p>
            <em>
              They backed up their global campaign with a petition that targets
              the same problem in order to gain additional support and establish
              a community. Currently, more than 300 people have signed the
              petition.
            </em>
          </p>

          <p>
            <em>
              Blockchain has not only altered art, but has also aided artists in
              finding new clients without having to go through traditional art
              gatekeepers. However, in order to create a safer creative space,
              it is critical to recognize the loopholes that exist from the
              artist's perspective.
            </em>
          </p>

          <p>
            If you are an artist who wishes to voice his vision, drop them a
            mail at{" "}
            <a href="mailto:cm@booliennetwork.com">cm@booliennetwork.com</a>
          </p>

          <p>
            Sign the petition:{" "}
            <Link href="https://chng.it/ypHKdmzC">
              <a target="_blank">https://chng.it/ypHKdmzC</a>
            </Link>
          </p>
        </StyledBlog>
      </MaxWidth>
      <Footer />
    </>
  );
}
