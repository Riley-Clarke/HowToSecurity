import NavBar from "../src/components/NavBar";

export default function MainLayout({ children }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
}