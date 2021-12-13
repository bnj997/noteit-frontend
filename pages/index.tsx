import type { NextPage } from "next";
import { withApollo } from "../utils/withApollo";
import NavBar from "../components/NavBar";
import { useMeQuery } from "../generated/graphql";

const Index: NextPage = () => {
  const { data, loading } = useMeQuery();
  return (
    <>
      <NavBar />
      <div>Hello {data?.me?.email}</div>
    </>
  );
};

export default withApollo({ ssr: true })(Index);
