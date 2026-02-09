export default function FrontendLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <main>{children} </main>;
}
