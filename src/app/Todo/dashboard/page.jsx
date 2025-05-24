"use client";
import React, { useEffect } from 'react'
import isAuthorised from '../../../../utils/isAuthorised'
import { useRouter } from 'next/navigation';
import LoadingPage from '@/component/loading/page';


function page() {
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const verify = await isAuthorised();
      if (!verify) {
        router.push("/");
      } else {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <LoadingPage />
  }
  return (

    <div>

      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi atque nobis ea dicta perferendis maxime incidunt dolorem ipsa. Eveniet laboriosam necessitatibus voluptatem blanditiis voluptas adipisci inventore natus. Non, expedita laborum explicabo cum praesentium repudiandae veritatis facilis aliquid numquam tempore deserunt veniam dignissimos suscipit illum quam. Mollitia, ullam rem inventore corporis neque cumque aspernatur pariatur vel ab molestias assumenda officiis sunt sequi accusantium perferendis iste ratione incidunt tempora. Placeat porro asperiores veniam quam aspernatur nam veritatis sapiente! Eveniet quisquam delectus est totam quibusdam ratione saepe incidunt ex similique quam placeat, non dolorum deserunt consequatur suscipit! Dolor aliquid distinctio molestias. Repellat, accusantium?</div>
  )
}

export default page