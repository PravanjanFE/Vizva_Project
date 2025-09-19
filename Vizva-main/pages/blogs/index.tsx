import styled from "@emotion/styled";
import Link from "next/link";
import Theme from "components/layout/Theming";
import Navbar from "components/navigation/navbar";
import Head from "next/head";
import { posts } from "entities/blog";
import Image, { StaticImageData } from "next/image";
import GridHelper from "components/layout/gridHelper";
import MaxWidth from "components/layout/maxWidth";
import Footer from "components/pages/home/footer";
import { breakpoint } from "public/breakpoint";

export default function Blogs() {
  return (
    <Theme>
      <>
        <Head>
          <title>Vizva - Blogs</title>
        </Head>
        <Navbar />
        <MaxWidth>
          <StyledBlog>
            <div className="post-container">
              {posts.map((post, index) => (
                <BlogPost key={index} {...post} />
              ))}
            </div>
          </StyledBlog>
        </MaxWidth>
        <Footer />
      </>
    </Theme>
  );
}

export interface Post {
  title: string;
  description: string;
  coverImage: StaticImageData | string;
  date: string;
  duration: string;
  href: string;
}

interface BlogPostProps {
  data: Post;
}

function BlogPost(props: Post) {
  const { title, description, coverImage, date, duration, href } = props;
  return (
    <Link href={href ? href : "/"}>
      <StyledBlogPost>
        <div className="image-container">
          <Image
            alt="cover"
            src={coverImage}
            layout="fill"
            objectFit="cover"
            quality={100}
            sizes="300px"
          />
        </div>
        <div className="hr"></div>
        <div className="content">
          <h3>{title}</h3>
          <p>{description.slice(0, 100)}...</p>
        </div>
        <div className="footer">
          <p>{date}</p>
          <p className="duration">{duration}</p>
        </div>
      </StyledBlogPost>
    </Link>
  );
}

const StyledBlog = styled.div`
  padding-top: var(--padding-6);

  .post-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--padding-5);
    ${breakpoint("md")} {
      grid-template-columns: 1fr 1fr;
    }
    ${breakpoint("lg")} {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
`;

const StyledBlogPost = styled.a`
  background-color: ${(props) => props.theme.onBackground};
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr max-content;
  max-width: 373px;
  cursor: pointer;
  border-radius: 30px;

  .image-container {
    position: relative;
    overflow: hidden;
    height: 200px;
    width: 100%;
    border-radius: 30px 30px 0 0;
  }
  .hr {
    height: 3px;
    background-color: ${(props) => props.theme.green};
    width: 0;
    transition: width 250ms ease 150ms;
  }
  .content,
  .footer {
    padding: var(--padding-6);
  }
  .content {
    h3 {
      font-size: 1.5rem;
      line-height: 1.2em;
      padding-bottom: var(--padding-4);
    }
    p {
      font-size: var(--fontsizes-1);
      line-height: 1.5em;
      font-weight: 200;
    }
  }
  .footer {
    padding-top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      font-size: var(--fontsizes-1);
      color: ${(props) => props.theme.gray3};
    }
  }

  &:hover {
    .hr {
      width: 100%;
    }
  }
`;
