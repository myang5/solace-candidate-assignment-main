"use client";

import { useEffect, useState } from "react";
import { GetAdvocatesResponseType } from "./api/advocates/route";
import TextInput from "./components/TextInput";

export default function Home() {
  const [advocates, setAdvocates] = useState<GetAdvocatesResponseType>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<GetAdvocatesResponseType>([]);
  const [searchTerm, setSearchTerm] = useState<string>();

  useEffect(() => {
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    setFilteredAdvocates(filterAdvocates(advocates, searchTerm));
  };

  const onClick = () => {
    setFilteredAdvocates(advocates);
    setSearchTerm("");
  };

  return (
    <main className="m-[24px]">
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <TextInput value={searchTerm} onChange={onChange} />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <th>First Name</th>
          <th>Last Name</th>
          <th>City</th>
          <th>Degree</th>
          <th>Specialties</th>
          <th>Years of Experience</th>
          <th>Phone Number</th>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={advocate.id}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}

const filterAdvocates = (advocates: GetAdvocatesResponseType, searchTerm: string) => {
  const searchTermLower = searchTerm.toLowerCase();
  return advocates.filter((advocate) => {
    return (
      advocate.firstName.toLowerCase().includes(searchTermLower) ||
      advocate.lastName.toLowerCase().includes(searchTermLower) ||
      advocate.city.toLowerCase().includes(searchTermLower) ||
      advocate.degree.toLowerCase().includes(searchTermLower) ||
      advocate.specialties.some((specialty) => specialty.toLowerCase().includes(searchTermLower)) ||
      String(advocate.yearsOfExperience).includes(searchTermLower)
    );
  });
};
