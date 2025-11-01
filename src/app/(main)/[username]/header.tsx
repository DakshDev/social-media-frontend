import { Button } from "@/components/ui/button";
import { UserType } from "@/types/user_types";
import { EllipsisVertical, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function Header({ props, username }: { props: UserType, username: string }) {
  return (
    <header className='relative bg-accent/50 p-4 rounded-lg flex gap-12 justify-center items-center'>
        <Image
          alt='profile pic'
          src={`${!props.avatar ? "/images/avatar.jpg" : props.avatar}`}
          height={100}
          width={100}
          className='size-32 w-auto object-cover object-center rounded-full border-2 border-border'
          priority={true}
        />
        <section className="text-sm max-w-xs grid gap-1">
          <div>
            <h1 className="text-[16px] capitalize font-semibold">{props.name}</h1>
            <h2 className="text-xs text-muted-foreground">@{props.username}</h2>
          </div>
          <p className="text-muted-foreground leading-4">{props.bio ? props.bio : "Life is a grand tapestry, woven with threads of joy and sorrow, triumph and defeat, all blending to form the unique pattern of our existence."}</p>
          {props.website ? <a href={`${props.website}`} className="text-blue-400 hover:text-blue-500 lowercase">{props.website}</a> : null}
          
          <div className="flex gap-2">
            <Button variant="secondary">Followers</Button>
            <Button variant="secondary">Following</Button>
          </div>
        </section>
        {/* Setting Section */}
        <section className="grid gap-2 absolute right-5 top-5">
            <Link href={`@${username}/edit`}><Button className="p-0 size-8"><Pencil className="text-muted"/></Button></Link>
            <Button className="p-0 size-8"><EllipsisVertical className="text-muted"/></Button>
        </section>
    </header>
  );
}

export default Header;
