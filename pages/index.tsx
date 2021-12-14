import type { NextPage } from "next";
import { withApollo } from "../utils/withApollo";
import NavBar from "../components/NavBar";
import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";

const Index: NextPage = () => {
  const router = useRouter();
  const { data } = useMeQuery();

  return (
    <>
      <NavBar />
      <div>Hello {data?.me?.username}</div>
    </>
  );
};

export default withApollo({ ssr: true })(Index);
