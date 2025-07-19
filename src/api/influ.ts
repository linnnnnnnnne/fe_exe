//src/services/
const BASE_URL =
  "https://localhost:7035/api/influ";

export interface CreateInflu {
  email: string;
  password: string;
  name: string;
  gender: number;
  nickName: string;
  dateOfBirth: string;
  phoneNumber: string;
  follower: number;
  bio: string;
  cccd: string;
  linkImage: string;
  portfolio_link: string;
  area: string;
  linkmxh: string[];
  fieldIds: string[];
}

// Hàm lấy danh sách fieldIds từ field API
export const getAllFieldIds = async (): Promise<string[]> => {
  const res = await fetch(
    "https://localhost:7035/api/field/get-all"
  );
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Lấy danh sách lĩnh vực thất bại: ${error}`);
  }

  const data = await res.json();
  return data.data.map((field: { id: string }) => field.id); // ✅
};

// Hàm tạo influencer
export const createInflu = async (data: CreateInflu) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Tạo Influencer thất bại: ${error}`);
  }

  return await res.json();
};
