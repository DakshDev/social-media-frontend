import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InnerSections() {
  return (
    <div className='w-full'>
      <Tabs defaultValue='all'>
        <div className='flex justify-center items-center'>
          <TabsList className='bg-accent/50 p-0'>
            <TabsTrigger
              className='p-4'
              value='all'
            >
              All
            </TabsTrigger>
            <TabsTrigger
              className='p-4'
              value='post'
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              className='p-4'
              value='video'
            >
              Videos
            </TabsTrigger>
            <TabsTrigger
              className='p-4'
              value='saved'
            >
              Saved
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='all'>All</TabsContent>
        <TabsContent value='post'>Post</TabsContent>
        <TabsContent value='video'>video</TabsContent>
        <TabsContent value='saved'>Saved</TabsContent>
      </Tabs>
    </div>
  );
}
