import { getUser } from "@/utils/apis";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Header from "./header";
import InnerSections from "./inner_sections";
import { UserType } from "@/types/user_types";
import { cookies } from "next/headers";


export interface ProfilePageProps {
  params: { username: string };
}

// Main page
async function Page({ params }: ProfilePageProps) {
  const { username } = await params;
  const countUnique = (username.match(/%40/g) || []).length;
  if (countUnique != 1) return notFound();
  const filtered_username = username.split("").splice(3).join("");
  if (!username.startsWith("%40")) return notFound();

  return (
    <div>
      <Suspense fallback={<p>Loading data...</p>}>
        <Profile uname={filtered_username} />
      </Suspense>
    </div>
  );
}

async function Profile({ uname }: { uname: string }) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString(); // Converts all cookies to header format
  const userInfo: UserType  = await getUser(uname, cookieHeader);
  if (userInfo === null) return notFound();

  return (
    <div className='w-full mx-auto'>
      <Header
        username={uname}
        props={userInfo}
      />
      <div className='flex gap-4 mt-14'>
        <InnerSections />
      </div>
    </div>
  );
}

export default Page;
