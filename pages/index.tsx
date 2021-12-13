import type { NextPage } from "next";
import NavBar from "../components/NavBar";
import { useMeQuery } from "../generated/graphql";

const Home: NextPage = () => {
  const { data, loading } = useMeQuery();
  return (
    <>
      <NavBar />
      <div>Hello {data?.me?.email}</div>
    </>
  );
};

export default Home;
