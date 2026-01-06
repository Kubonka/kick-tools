"use client";
import React from "react";
import rawDomains from "./dominios.json";
import { useTabListener } from "./useTabListener";
type Props = {
  search: string;
  onTabPressed: (nombrePais: string) => void;
};
export type Domain = {
  dominio: string;
  nombrePais: string;
};

function filterDomains(domains: Domain[], search: string, limit = 5): Domain[] {
  const query = search.trim().toLowerCase();

  if (!query) return [];

  return domains
    .filter((d) => d.nombrePais.toLowerCase().includes(query))
    .slice(0, limit);
}

function AutofillHelper({ search, onTabPressed }: Props) {
  const results = filterDomains(rawDomains, search);

  useTabListener(() => {
    if (results.length > 0) {
      onTabPressed(results[0].nombrePais);
    }
  });

  if (results.length === 0) return null;

  return (
    <ul className="absolute z-10 top-[40px] mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
      {results.map((domain) => (
        <li
          key={domain.dominio}
          className="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-800"
          onClick={() => {
            onTabPressed(domain.nombrePais);
          }}
        >
          <span className="font-medium">{domain.nombrePais}</span>
        </li>
      ))}
    </ul>
  );
}

export default AutofillHelper;
