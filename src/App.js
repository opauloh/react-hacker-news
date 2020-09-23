import React from 'react';
import useSWR from 'swr';

const storiesFetcher = (...args) =>
  fetch(...args)
    .then((res) => res.json())
    .then((res) => res.filter((_, idx) => idx < 20))
    .then((res) =>
      Promise.all(
        res.map((r) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${r}.json`).then((res) => res.json())
        )
      )
    );

function TopStories() {
  const { data, error } = useSWR(
    'https://hacker-news.firebaseio.com/v0/topstories.json',
    storiesFetcher
  );

  if (error) return <div>Error communicating API</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <ul>
      {data.map((d) => (
        <li key={d.id}>
          <h5>{d.title}</h5>
          <div>
            by {d.by} on {new Date(d.time * 1000).toLocaleString('pt-br')} with {d.descendants}{' '}
            comments
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  return <TopStories />;
}
