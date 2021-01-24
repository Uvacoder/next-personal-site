import { useRouter } from "next/router";
import { getAllWeeknotes, getWeeknote } from "../../../lib/api/content";
import markdownToHtml from "../../../lib/markdownToHtml";
import Layout from "../../../src/components/layout";

const WeeknotesTemplate = ({ weeknote }) => {
  const { year, slug, content } = weeknote;

  return (
    <Layout>
      <p>
        Weeknotes: {year} {slug}
      </p>
      <div className={"prose"} dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  );
};

// WeeknotesTemplate.getInitialProps = async (context) => {
//   const { year, slug } = context.query;

//   return { year, slug };
// };

export async function getStaticProps({ params }) {
  // const post = getPostBySlug(params.slug, [
  //   'title',
  //   'date',
  //   'slug',
  //   'author',
  //   'content',
  //   'ogImage',
  //   'coverImage',
  // ])
  const { year, slug } = params;
  const weeknote = getWeeknote(year, slug);
  const content = await markdownToHtml(weeknote.content || "");

  return {
    props: {
      weeknote: {
        ...weeknote,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const weeknotes = await getAllWeeknotes();

  return {
    paths: weeknotes.map(({ year, slug, ...rest }) => {
      return {
        params: {
          year: year,
          slug: slug,
        },
      };
    }),
    fallback: false,
  };
}

export default WeeknotesTemplate;
