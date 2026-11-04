import Link from 'next/link';
import Reveal from '../animations/Reveal';
import type { Post } from '@/lib/content';
export default function PostCard({ p }: { p: Post }) {
  return (
    <Reveal className="post"><time dateTime={p.date}>{p.date}</time><h2><Link href={`/insights/${p.slug}`}>{p.title}</Link></h2><p>{p.excerpt}</p></Reveal>
  );
}
