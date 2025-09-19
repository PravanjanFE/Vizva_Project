import styled from "@emotion/styled";
import MaxWidth from "components/layout/maxWidth";
import Navbar from "components/navigation/navbar";
import Footer from "components/pages/home/footer";
import Head from "next/head";
import Link from "next/link";

export default function CreatorsRenaissance() {
  return (
    <>
      <Head>
        <title>Introducing Vizva: Creators Renaissance</title>
        <meta
          name="description"
          content="Today, we're excited to introduce Vizva, a feature-rich and
          entertaining platform where you can freely and easily display and
          exchange NFTs, such as your artworks, crazy dancing videos, rare
          Pokemon cards+, and grandma's cookies. An exclusive community
          marketplace for buying, selling, and exchanging NFT-authenticated
          digital collectibles all around the world."
        />

        {/* facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://vizva.io/blog/creators%20renaissance`}
        />
        <meta
          property="og:title"
          content="Introducing Vizva: Creators Renaissance"
        />
        <meta
          property="og:image"
          content="https://cdn.discordapp.com/attachments/877089668401889321/967047330413035541/Vizva_Blog_01.jpg"
        />
        <meta
          property="og:description"
          content="Today, we're excited to introduce Vizva, a feature-rich and
          entertaining platform where you can freely and easily display and
          exchange NFTs, such as your artworks, crazy dancing videos, rare
          Pokemon cards+, and grandma's cookies. An exclusive community
          marketplace for buying, selling, and exchanging NFT-authenticated
          digital collectibles all around the world."
        />

        {/* twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:title"
          content="Introducing Vizva: Creators Renaissance"
        />
        <meta
          property="twitter:image"
          content="https://cdn.discordapp.com/attachments/877089668401889321/967047330413035541/Vizva_Blog_01.jpg"
        />

        {/* change to handle of the owners */}
        <meta property="twitter:site" content="@intovizva" />
        <meta property="twitter:creator" content="@intovizva" />
      </Head>
      <Navbar showSearch={false} />
      <MaxWidth>
        <StyledBlog>
          <img
            src="https://cdn.discordapp.com/attachments/877089668401889321/967047330413035541/Vizva_Blog_01.jpg"
            alt="image"
          />
          <h1>Introducing Vizva: Creators Renaissance</h1>
          <div className="meta">
            <p>On Sep 1 2021</p>
            <p>3 Min Read</p>
          </div>

          <div className="content">
            <p>
              NFTs are the talk of the town among the creators. They're gaining
              a lot of traction as a place for artists, makers, and investors to
              create, find, explore, and collect one-of-a-kind artworks from all
              over the world, as well as diversify their income streams.
            </p>
            <p>
              Are you new to the world of NFT? Learn about NFTs, why people buy
              them, some recent news about them, and where they're headed by
              clicking{" "}
              <Link href="https://www.youtube.com/watch?v=dUwVXJ-iRJc&t=1s">
                <a target="_blank">here</a>
              </Link>
              .
            </p>
            <p>
              Imagine putting hours into creating an NFT that you've always
              wanted, only to have it sit in a corner of an auction house or a
              digital gallery. Doesn't it hurt?
            </p>
            <p>
              So, once you've created an NFT, you'll need a perfect marketplace
              to shift it and get it to the correct audience's attention. And
              that is just what we are bringing to life.
            </p>
            <h2>
              Bring your creative project to life with Vizva.{" "}
              <Link href="/connectwallet">
                <a>Sign up here</a>
              </Link>
            </h2>

            <h2>Introducing Vizva: Creators Renaissance</h2>
            <p>
              Today, we're excited to introduce Vizva, a feature-rich and
              entertaining platform where you can freely and easily display and
              exchange NFTs, such as your artworks, crazy dancing videos, rare
              Pokemon cards+, and grandma's cookies. An exclusive community
              marketplace for buying, selling, and exchanging NFT-authenticated
              digital collectibles all around the world.
            </p>

            <h2>How does Vizva empower the creator’s economy?</h2>

            <p>
              Your network is your net worth, as the expression goes. As a
              result, simply creating isn't enough for a creator. You must also
              seek out, interact with, and collaborate with like-minded others
              in the area. We understand!
            </p>
            <p>
              Vizva, as a community-focused digital arena, welcomes all
              platforms to build and extend their networks of companion
              producers and curators, fans and followers, and buyers and
              dealers.
            </p>
            <p>
              Here's a quick rundown of how our marketplace will contribute to
              the growth of the creator economy —
            </p>

            <h3>Identify Your tribes.</h3>
            <p>
              Vizva makes it simple to find creators, artists, fans, followers,
              and other members of the community who share your interests.
              You'll be able to interact, engage, and have a great time!
            </p>

            <h3>Collaborate with budding creators.</h3>
            <p>
              You can work with other artists, fans, curators, and everyone else
              who is a part of this ecosystem here. You can form groups and
              collaborate to produce stunning artworks by joining hands with
              those who share your vision and participating in fascinating
              activities.
            </p>

            <h3>Create your legacy.</h3>
            <p>
              Imagine your work making an indelible mark on the globe, inspiring
              future generations. Your masterpieces can be co-shared among the
              creators, admirers, and followers within the community using a
              community-centric decentralized ecosystem built on blockchain,
              allowing them to become a part of your art and allowing your
              creations to stay inside the hearts of the community.
            </p>

            <blockquote>
              “An image speaks a thousand words. With Vizva, you can explore
              these expressions by enabling{" "}
              <Link href="https://medium.com/@Boolien/what-is-metaverse-8ef356f81d">
                <a target="_blank">Metaverse</a>
              </Link>{" "}
              properties to your creations. You don’t create just an NFT, you
              truly empower your art to express itself and communicate with the
              people around, leaving a trail of your legacy.” —{" "}
              <em>Sudipto, Co-Founder, Boolien</em>
            </blockquote>

            <h3>Why Vizva?</h3>
            <p>
              Hey, there are already a lot of NFT marketplaces out there. Why
              should I go with Vizva? We recognize the tremendous contribution
              of creators to the world of NFT because we are a pool of makers
              ourselves.
            </p>
            <p>
              We're delivering some incredibly cool and unique features to
              Vizva, a beta version in 2022, to help creative brains like yours
              fulfill their potential to the fullest.
            </p>

            <ul>
              <li>
                <p>
                  <strong>Collaboration:</strong> You can now talk to your
                  buddies directly in the space, discuss your initiatives, and
                  start working on something large together!
                </p>
              </li>
              <li>
                <p>
                  <strong>Curation:</strong> Our goal is to bring together
                  prominent curators and artists from all around the world to
                  inspire and support community-curated ideas and initiatives.
                </p>
              </li>
              <li>
                <p>
                  <strong>Gas fees:</strong> The gas price is the fee charged by
                  NFT trading platforms to make transactions or execute
                  contracts on their blockchain platform. We've enabled Polygon,
                  a layer 2 solution that allows you to easily create while also
                  ensuring quick execution and lower network fees. This will
                  allow you to mint your NFT masterpieces for a low cost of Gas.
                </p>
              </li>
              <li>
                <p>
                  <strong>Lazy minting:</strong> Lazy minting is a method in
                  which a portion of the purchase price is used to reimburse the
                  cost
                </p>
              </li>
              <li>
                <strong>Verified profile:</strong> Creators get an opportunity
                to have their profiles verified before listing their artwork.
              </li>
            </ul>

            <h3>WHERE IS VIZVA HEADED TO?</h3>
            <p>
              Consider converting your NFTs into interesting replaceable game
              components that might remain indefinitely. What a fantastic idea!
            </p>
            <p>
              Your NFTs will no longer be harmless trading items when you use
              Vizva. Your NFTs might be anything you choose, from a showcase
              item on a large screen to your virtual real estate, complete with
              virtual galleries and museums. You may even walk around in other
              virtual worlds and look at different artists' collections. Your
              NFT could be a music album or a concert ticket for one of your
              favorite musicians. Your NFT could be a ticket to your favorite
              mentor's Scholarship program. Your NFT could be a gesture of
              appreciation for your support of a favorite project.
            </p>
            <p>
              Vizva will present a variety of usability options for your NFT
              projects, including:
            </p>

            <p>
              <strong>Linking NFTs as Digital Assets:</strong> Your NFTs can be
              linked and utilized to communicate with other users and act as
              digital assets throughout various games and movies.
            </p>

            <p>
              You can <strong>kick-start your project</strong> and{" "}
              <strong>recruit clan members</strong> to support it in exchange
              for mystical NFT.
            </p>

            <p>
              <strong>NFT pooling and farming:</strong> You can stake an NFT to
              earn token rewards or stake tokens to receive an NFT.
            </p>

            <p>
              <strong>Curated NFT packs:</strong> Collectors can invest in a
              fraction of NFTs and have a nextgen way of investing in digital
              assets thanks to curated NFT Packs curated by Boolien DAO members.
            </p>

            <p>
              <strong>Fractionalized Ownership:</strong> Your NFTs' ownership
              might be divided down and fractionalized to allow a vast number of
              small and medium-scale digital collectibles fans and followers to
              get a piece of the action.
            </p>

            <p>
              <strong>NFTs as a fan reward:</strong> Your NFTs can also be used
              to recruit and incentivize your project's fans and followers.
            </p>

            <p>
              All of this is being built by a decentralized community, with
              Transparency, Liquidation, and Growth as its building pieces, and
              supported by
              <Link href="https://medium.com/@Boolien">
                <a target="_blank">Boolien</a>
              </Link>
            </p>

            <p>
              <em>
                We have a mountain to climb at Vizva that will be decentralised;
                we can only do it with the community's help.
              </em>
            </p>

            <p>
              <em>
                The creator's economy is full of surprises, which we will
                uncover with your help. Vizva can be anything you want it to be,
                so grab your paintbrushes, pens, and those delectable pastries
                and enter the creator's palace to own your fantasy!
              </em>
            </p>

            <p>
              <em>
                The Boolien ecosystem's initial flagship product, Vizva, helps
                artists, curators, creators, and everything human. Vizva is the
                starting point for Boolien's quest to construct an infinite
                metaverse of possibilities.
              </em>
            </p>

            <blockquote>
              "As humans, we enjoy being linked with something we truly believe
              in, whether it is something we made or someone we respect.
              However, it is not an easy task. By being a Booliener, you will be
              able to achieve your goals, participate in anything in the world
              that you passionately believe in, and be rewarded for doing so!
              Boolien is an environment that strengthens your beliefs and allows
              you to realize your dreams.” -{" "}
              <em>Pravanjan Patnaik, Co-Founder, Boolien</em>
            </blockquote>

            <h3>About Vizva:</h3>
            <p>
              Vizva is a Boolien-only product that serves as an entry point into
              the NFT ecosystem we're creating with the community. The goal is
              to make it simple to use so that you may not only purchase, sell,
              and trade NFTs, but also use them in the liquidity pool and
              connect with producers and followers on various chains.
            </p>
            <p>
              All game developers, visual artists, photographers, story writers,
              TV series directors, and creators, in general, are invited to
              Vizva's event. We intend to provide a community-centered platform
              for projects that require crowdfunding or even community
              acceptability testing.
            </p>

            <h2>
              Bring your creative project to life with Vizva.
              <br />
              <Link href="/connectwallet">
                <a>Sign up here</a>
              </Link>
            </h2>
          </div>
        </StyledBlog>
      </MaxWidth>
      <Footer />
    </>
  );
}

export const StyledBlog = styled.div`
  min-height: 100vh;
  max-width: 900px;
  margin: 0 auto;

  img {
    display: block;
    width: 100%;
    height: auto;
  }

  .content {
    /* max-width: 700px; */
    margin: 0 auto;
    padding: 0 var(--padding-6);
  }

  h1 {
    text-align: center;
    font-size: var(--fontsizes-8);
    font-weight: 700;
  }
  h3 {
    font-size: var(--fontsizes-5);
  }
  h2 {
    font-size: var(--fontsizes-7);
  }
  h1,
  h2,
  h3 {
    line-height: 1.3em;
    margin-top: var(--padding-8);
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin: var(--padding-4) 0 var(--padding-9) 0;
    padding: var(--padding-4) var(--padding-5);
    border-bottom: 1px solid ${(props) => props.theme.gray3};

    p {
      margin-bottom: 0 !important;
      font-weight: 600;
    }
  }

  p {
    line-height: 1.8em;
    &:not(:last-child) {
      margin-bottom: 1.3rem;
    }
  }

  a {
    color: ${(props) => props.theme.green};
    font-size: inherit;
  }

  blockquote {
    line-height: 1.8em;
    background-color: ${(props) => props.theme.onBackground};
    border-left: 5px solid ${(props) => props.theme.green};
    border-radius: 5px;
    padding: var(--padding-7);
    margin-bottom: var(--padding-7);
  }
`;
