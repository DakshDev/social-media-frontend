import { getUser } from "@/utils/apis";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Header from "./header";
import InnerSections from "./inner_sections";
import AboutSection from "./about";
import { UserType } from "@/types/user_types";

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
  const userInfo = await getUser(uname);
  console.log(userInfo)
  if (userInfo === null) return notFound();
  const { avatar, banner } = userInfo as UserType;

  return (
    <div className='w-full mx-auto'>
      <Header
        avatar={avatar}
        banner={banner}
      />
      <div className='flex gap-4 mt-14'>
        <div className='w-md h-fit sticky top-4 p-4 bg-accent/50'>
          <AboutSection />
        </div>
        <InnerSections />
      </div>
    </div>
  );
}

export default Page;
