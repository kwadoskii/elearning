import Link from "next/link";
import { useRouter } from "next/router";
import { getTopics } from "../../../api/topics";
import Cookies from "js-cookie";
import { Breadcomb, Header, Layout, LearnCard } from "../../../components";

export default function PickASubjectPage({ topics }) {
  const { query } = useRouter();
  const setTopic = (id, name) => {
    Cookies.set("topic_id", id);
    Cookies.set("topic_name", name);
    Cookies.set("subject_name", query.subject);
  };
  return (
    <Layout title={`Pick a ${query.subject} Topic`}>
      <div>
        <Breadcomb />

        <Header
          text={`Nice! Now choose a topic in ${query.subject?.replace(/_/g, " ")} you love...`}
          className="mt-3"
        />

        <div className="max-w-7xl w-full mr-auto my-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-10">
            {topics.map(({ id, topic_name, percentage = 0 }) => (
              <Link
                href={{
                  pathname: "/learn/[subject]/[topic]",
                  query: {
                    topic: topic_name.replace(/[^a-zA-Z0-9?.:]/g, "_"),
                    subject: query.subject,
                  },
                }}
                key={id.toString()}
                passHref
              >
                <a onClick={() => setTopic(id, topic_name)}>
                  <LearnCard title={topic_name} subtitle={percentage} hasNoIcon />
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ({ req: { cookies } }) => {
  // const class_id = JSON.parse(JSON.parse(cookies["persist%3Aroot"]).profile).profile.class;
  const class_id = JSON.parse(JSON.parse(cookies["persist%3Aroot"]).grade)?.grade.id;

  const { status, data: topics } = await getTopics(class_id, cookies.subject_id, cookies.token);
  if (status !== 200) topics = [];

  return {
    props: { topics },
  };
};
