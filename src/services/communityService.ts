import type { SymptomType } from "../types"

export interface CommunityPost {
  id: string;
  userNmae: string;
  userIcon: string;
  prefecture: string;
  weather: {
    condition: "sunny" | "cloudy" | "rainy" | "snowy";
    pressure: number;
    pressureChange: number;

  };
  symptoms: SymptomType[];
  note: string;
  empathyCount: number;
  isEmpathized: boolean;
}

const dummyNotes =[
  "今日は、一日中、頭が重くて何も手に付かなかった。",
  "気圧のせいか、朝から目眩がひどい。",
  "肩がこり、動かせない。",
  "季節の変わり目はいつも関節が痛む。",
  "吐き気がして食欲がない。ゆっくり休むしかないかな。",
  "寒気がして、体調がすぐれない",
  "ストレスからかわからないが、肌の調子が悪い"
]

const userNames = ["ジョアン・べドロ", "エステバン・ウィリアン","ディラップ", "ギッテンス"]
const prefectures = ["東京都", "大阪府", "愛知県", "福岡県", "北海道", "沖縄県"]
const userIcons = ["🐶", "😺", "🐼", "🐻", "🐰"]
const symptomsList: SymptomType[] = ["頭痛", "めまい", "肩こり", "眠気", "関節痛", "だるさ", "吐き気", "耳鳴り", "発熱", "食欲不振", "こり・関節痛", "肌荒れ"];

// ダミーデータ生成関数
export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
  const posts: CommunityPost[] = [];
  for (let i = 0; i < 20; i++) {
    const randomSymptomsCount = Math.floor(Math.random())*3 + 1;
    const randomSymptoms = [...symptomsList].sort(() => 0.5 - Math.random()).slice(0, randomSymptomsCount);

    posts.push({
      id: `post-${i}`,
      userNmae: userNames[Math.floor(Math.random()*userNames.length)],
      userIcon: userIcons[Math.floor(Math.random()*userIcons.length)],
      prefecture: prefectures[Math.floor(Math.random()*prefectures.length)],
      timestamp: `${Math.floor(Math.random()* 10)+1}時間前`,
      weather: {
        condition: ["sunny", "cloudy", "rainy"][Math.floor(Math.random()*3)],
        pressure: Math.floor(Math.random()*1024),
        pressureChange: Math.round((Math.random()*10-5)*10)/10,
      },
      symptoms: randomSymptoms,
      note: dummyNotes[Math.floor(Math.random()*dummyNotes.length)],
      empathyCount: Math.floor(Math.random()*50),
      isEmpathized: Math.random() > 0.5,
    });
  }
  return Promise.resolve(posts);
};