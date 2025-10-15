import { SelectAdvocate } from "@/db/schema";

export default function AdvocateListItem({ advocate }: { advocate: SelectAdvocate }) {
  return (
    <div className="py-[20px] flex flex-col md:flex-row md:gap-x-[20px]">
      <div className="w-full md:w-[200px]">
        <p>
          {advocate.firstName} {advocate.lastName}, {advocate.degree}
        </p>
        <p>{advocate.city}</p>
        <p>{advocate.yearsOfExperience} years of experience</p>
        <p>{formatPhoneNumber(advocate.phoneNumber)}</p>
      </div>
      <div className="w-full">
        <p>Specialties:</p>
        <div>
          {advocate.specialties.map((s) => (
            <p key={s}>{s}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

const formatPhoneNumber = (value?: string) => {
  if (!value) {
    return value;
  }

  const groupDigitsIntoPhoneNumberGroups = (str: string) =>
    str.match(/^(\d{3})(\d{3})?(\d{4})/) || [];

  const groups = groupDigitsIntoPhoneNumberGroups(value);
  return `(${groups[1]}) ${groups[2]}-${groups[3]}`;
};
