/**
 * Built-in demo data — ported from the mobile app's src/data/mockData.ts.
 * Used by the data service when Firebase is disabled so the dashboard renders
 * a realistic, populated UI with zero backend.
 */
const now = Date.now();
const mins = (m) => now - m * 60_000;
const hrs = (h) => now - h * 3_600_000;
const days = (d) => now - d * 86_400_000;

const woman = (n) => `https://randomuser.me/api/portraits/women/${n}.jpg`;
const man = (n) => `https://randomuser.me/api/portraits/men/${n}.jpg`;

const femaleSeeds = [
  { id: "u1", name: "Ananya Sharma", age: 26, city: "Bengaluru", photoIdx: 44, online: true, premium: true, occupation: "Architect", company: "Studio Lotus", education: "B.Arch, CEPT", income: "₹18 LPA", religion: "Hindu", caste: "Brahmin", height: "5'5\"", weight: "55 kg", hobbies: ["Sketching", "Yoga", "Travel"], languages: ["English", "Hindi"], lastActiveMins: 2 },
  { id: "u2", name: "Ishita Rao", age: 27, city: "Bengaluru", photoIdx: 68, online: true, occupation: "Paediatrician", company: "Manipal Hospital", education: "MBBS, MD", income: "₹22 LPA", religion: "Hindu", height: "5'4\"", weight: "52 kg", hobbies: ["Gardening", "Music"], languages: ["English", "Kannada"], lastActiveMins: 5 },
  { id: "u3", name: "Priya Nair", age: 25, city: "Kochi", photoIdx: 12, online: false, premium: true, occupation: "Content Strategist", company: "Freelance", education: "MA English", income: "₹14 LPA", religion: "Hindu", height: "5'6\"", weight: "58 kg", hobbies: ["Dancing", "Writing"], languages: ["English", "Malayalam"], lastActiveMins: 90 },
  { id: "u4", name: "Sara Khan", age: 28, city: "Mumbai", photoIdx: 30, online: true, occupation: "Product Manager", company: "Razorpay", education: "MBA, ISB", income: "₹32 LPA", religion: "Muslim", height: "5'7\"", weight: "60 kg", hobbies: ["Salsa", "Travel"], languages: ["English", "Urdu"], lastActiveMins: 1 },
  { id: "u5", name: "Meera Iyer", age: 26, city: "Chennai", photoIdx: 65, online: false, occupation: "Data Scientist", company: "Freshworks", education: "M.Tech, IIT Madras", income: "₹26 LPA", religion: "Hindu", caste: "Iyer", height: "5'3\"", weight: "50 kg", hobbies: ["Singing", "Running"], languages: ["English", "Tamil"], lastActiveMins: 240 },
  { id: "u6", name: "Zoya Sheikh", age: 27, city: "Hyderabad", photoIdx: 47, online: true, occupation: "Interior Designer", company: "Livspace", education: "B.Des NID", income: "₹16 LPA", religion: "Muslim", height: "5'6\"", weight: "57 kg", hobbies: ["Baking", "Pottery"], languages: ["English", "Telugu"], lastActiveMins: 8 },
  { id: "u7", name: "Riya Kapoor", age: 24, city: "Delhi", photoIdx: 9, online: false, premium: true, occupation: "Corporate Lawyer", company: "AZB & Partners", education: "LLB, NLU", income: "₹24 LPA", religion: "Hindu", caste: "Khatri", height: "5'5\"", weight: "54 kg", hobbies: ["Debating", "Tennis"], languages: ["English", "Punjabi"], lastActiveMins: 300 },
  { id: "u8", name: "Aisha Patel", age: 29, city: "Ahmedabad", photoIdx: 79, online: true, occupation: "Entrepreneur", company: "Kora Label", education: "BBA", income: "₹20 LPA", religion: "Hindu", height: "5'4\"", weight: "53 kg", hobbies: ["Fashion", "Cooking"], languages: ["English", "Gujarati"], lastActiveMins: 3 },
  { id: "u9", name: "Tara Menon", age: 26, city: "Pune", photoIdx: 21, online: false, occupation: "Marine Biologist", company: "NIO", education: "M.Sc Marine Bio", income: "₹15 LPA", religion: "Christian", height: "5'6\"", weight: "56 kg", hobbies: ["Diving", "Hiking"], languages: ["English", "Malayalam"], lastActiveMins: 720 },
  { id: "u10", name: "Naina Verma", age: 25, city: "Bengaluru", photoIdx: 90, online: true, premium: true, occupation: "UX Researcher", company: "Google", education: "M.Des IISc", income: "₹30 LPA", religion: "Hindu", height: "5'5\"", weight: "55 kg", hobbies: ["Pottery", "Music"], languages: ["English", "Hindi"], lastActiveMins: 1 },
  { id: "u11", name: "Fatima Ali", age: 28, city: "Lucknow", photoIdx: 24, online: false, occupation: "Professor", company: "Lucknow University", education: "PhD English", income: "₹17 LPA", religion: "Muslim", height: "5'4\"", weight: "58 kg", hobbies: ["Poetry", "Gardening"], languages: ["English", "Urdu"], lastActiveMins: 480 },
  { id: "u12", name: "Diya Reddy", age: 27, city: "Hyderabad", photoIdx: 57, online: true, occupation: "Investment Banker", company: "Goldman Sachs", education: "MBA, IIM-A", income: "₹40 LPA", religion: "Hindu", caste: "Reddy", height: "5'6\"", weight: "56 kg", hobbies: ["Painting", "Golf"], languages: ["English", "Telugu"], lastActiveMins: 6 },
];

const maleSeeds = [
  { id: "m0", name: "Aarav Mehta", age: 29, city: "Bengaluru", photoIdx: 32, online: true, premium: true, occupation: "Product Designer", company: "Ripple Studios", education: "M.Des, IIT Bombay", income: "₹28 LPA", religion: "Hindu", caste: "Agarwal", height: "5'11\"", weight: "74 kg", hobbies: ["Trekking", "Cooking"], languages: ["English", "Hindi"], lastActiveMins: 0 },
  { id: "m1", name: "Rohan Kapoor", age: 30, city: "Bengaluru", photoIdx: 33, online: true, premium: true, occupation: "Founder", company: "Nimbus Labs", education: "B.Tech, BITS", income: "₹45 LPA", religion: "Hindu", caste: "Khatri", height: "5'11\"", weight: "76 kg", hobbies: ["Cooking", "Cricket"], languages: ["English", "Punjabi"], lastActiveMins: 2 },
  { id: "m2", name: "Arjun Nair", age: 29, city: "Kochi", photoIdx: 52, online: true, occupation: "Cardiologist", company: "Amrita Hospital", education: "MBBS, MD", income: "₹28 LPA", religion: "Hindu", height: "5'10\"", weight: "72 kg", hobbies: ["Music", "Fitness"], languages: ["English", "Malayalam"], lastActiveMins: 9 },
  { id: "m3", name: "Kabir Khan", age: 31, city: "Mumbai", photoIdx: 75, online: false, occupation: "Architect", company: "Morphogenesis", education: "B.Arch, JJ School", income: "₹32 LPA", religion: "Muslim", height: "6'0\"", weight: "78 kg", hobbies: ["Sketching", "Food"], languages: ["English", "Urdu"], lastActiveMins: 120 },
  { id: "m4", name: "Vikram Rao", age: 28, city: "Hyderabad", photoIdx: 60, online: true, occupation: "Data Scientist", company: "Microsoft", education: "M.Tech, IIT-H", income: "₹34 LPA", religion: "Hindu", caste: "Reddy", height: "5'9\"", weight: "70 kg", hobbies: ["Running", "Gaming"], languages: ["English", "Telugu"], lastActiveMins: 5 },
  { id: "m5", name: "Aditya Sharma", age: 32, city: "Delhi", photoIdx: 83, online: false, premium: true, occupation: "Corporate Lawyer", company: "Trilegal", education: "LLB, NLU", income: "₹38 LPA", religion: "Hindu", caste: "Brahmin", height: "6'1\"", weight: "80 kg", hobbies: ["Travel", "Tennis"], languages: ["English", "Hindi"], lastActiveMins: 200 },
];

const buildProfile = (s, i, gender, photo) => ({
  userId: s.id,
  email: `${s.name.split(" ")[0].toLowerCase()}@example.com`,
  phone: "+91 9" + (800000000 + i * 111111),
  verified: i % 7 !== 0,
  profileCompleted: true,
  premium: !!s.premium,
  online: s.online,
  suspended: i === 4,
  lastActive: mins(s.lastActiveMins),
  distanceKm: s.distance,
  photos: [photo(s.photoIdx), photo((s.photoIdx + 5) % 99), photo((s.photoIdx + 11) % 99)],
  personalInfo: {
    fullName: s.name,
    gender,
    age: s.age,
    dob: `${2026 - s.age}-06-15`,
    height: s.height,
    weight: s.weight,
    maritalStatus: "Single",
    city: s.city,
    photoUrl: photo(s.photoIdx),
    bio: `${s.occupation} based in ${s.city}. Looking for a genuine, warm and lasting connection.`,
  },
  educationInfo: {
    education: s.education,
    occupation: s.occupation,
    company: s.company,
    annualIncome: s.income,
    workLocation: s.city,
  },
  familyInfo: {
    fatherName: "Mr. " + s.name.split(" ")[1],
    motherName: "Mrs. " + s.name.split(" ")[1],
    familyType: i % 2 === 0 ? "Nuclear" : "Joint",
    siblings: i % 3,
    religion: s.religion,
    caste: s.caste || "",
  },
  lifestyleInfo: {
    smoking: "No",
    drinking: i % 3 === 0 ? "Occasionally" : "No",
    diet: s.religion === "Muslim" ? "Non-Vegetarian" : i % 2 === 0 ? "Vegetarian" : "Non-Vegetarian",
    hobbies: s.hobbies,
    languages: s.languages,
  },
  partnerPreferences: {
    ageRange: [s.age - 4, s.age + 2],
    preferredLocation: s.city,
    education: "Postgraduate",
    religion: s.religion,
    maritalStatus: "Single",
  },
  createdAt: days(30 + i * 3),
});

export const mockProfiles = [
  ...femaleSeeds.map((s, i) => buildProfile(s, i, "Female", woman)),
  ...maleSeeds.map((s, i) => buildProfile(s, i + 12, "Male", man)),
];

export const mockMatchRequests = [
  { requestId: "r1", senderId: "u2", receiverId: "m0", status: "Pending", createdAt: hrs(2) },
  { requestId: "r2", senderId: "u6", receiverId: "m0", status: "Pending", createdAt: hrs(9) },
  { requestId: "r3", senderId: "u8", receiverId: "m1", status: "Pending", createdAt: days(1) },
  { requestId: "r4", senderId: "m0", receiverId: "u3", status: "Pending", createdAt: hrs(5) },
  { requestId: "r5", senderId: "m0", receiverId: "u7", status: "Accepted", createdAt: days(2) },
  { requestId: "r6", senderId: "m0", receiverId: "u12", status: "Rejected", createdAt: days(3) },
  { requestId: "r7", senderId: "u1", receiverId: "m0", status: "Accepted", createdAt: days(4) },
  { requestId: "r8", senderId: "m0", receiverId: "u10", status: "Accepted", createdAt: days(5) },
  { requestId: "r9", senderId: "u4", receiverId: "m4", status: "Pending", createdAt: hrs(14) },
  { requestId: "r10", senderId: "m2", receiverId: "u9", status: "Accepted", createdAt: days(6) },
];

export const mockPhotoRequests = [
  { requestId: "p1", senderId: "m1", receiverId: "u3", status: "Pending", createdAt: hrs(3) },
  { requestId: "p2", senderId: "u5", receiverId: "m0", status: "Accepted", createdAt: days(1) },
  { requestId: "p3", senderId: "m4", receiverId: "u11", status: "Pending", createdAt: hrs(20) },
];

export const mockChatRooms = [
  { chatRoomId: "c1", userIds: ["m0", "u1"], lastMessage: "Haha that sounds perfect 😄 see you Saturday!", lastMessageTime: mins(4), unread: 2, createdAt: days(5) },
  { chatRoomId: "c2", userIds: ["m0", "u7"], lastMessage: "I loved that trek photo you shared 🏔️", lastMessageTime: hrs(3), unread: 0, createdAt: days(4) },
  { chatRoomId: "c3", userIds: ["m0", "u10"], lastMessage: "Good morning! Coffee before the museum?", lastMessageTime: hrs(20), unread: 1, createdAt: days(5) },
  { chatRoomId: "c4", userIds: ["m2", "u9"], lastMessage: "That dive spot looks amazing!", lastMessageTime: hrs(30), unread: 0, createdAt: days(6) },
];

export const mockMessages = [
  { messageId: "g1", chatRoomId: "c1", senderId: "u1", receiverId: "m0", message: "Hey Aarav! Your trekking photos are stunning 😍", messageType: "text", createdAt: hrs(6), isRead: true },
  { messageId: "g2", chatRoomId: "c1", senderId: "m0", receiverId: "u1", message: "Thank you! That was Kudremukh. Do you trek?", messageType: "text", createdAt: hrs(6), isRead: true },
  { messageId: "g3", chatRoomId: "c1", senderId: "u1", receiverId: "m0", message: "Haha that sounds perfect 😄 see you Saturday!", messageType: "text", createdAt: mins(4), isRead: false },
  { messageId: "g4", chatRoomId: "c2", senderId: "m0", receiverId: "u7", message: "Hi Riya! So glad we matched 🙌", messageType: "text", createdAt: hrs(5), isRead: true },
  { messageId: "g5", chatRoomId: "c2", senderId: "u7", receiverId: "m0", message: "I loved that trek photo you shared 🏔️", messageType: "text", createdAt: hrs(3), isRead: true },
  { messageId: "g6", chatRoomId: "c3", senderId: "u10", receiverId: "m0", message: "Good morning! Coffee before the museum?", messageType: "text", createdAt: hrs(20), isRead: false },
];

export const mockNotifications = [
  { notificationId: "n1", userId: "m0", title: "New match request 💌", body: "Ishita Rao sent you a request", type: "match_request", isRead: false, createdAt: hrs(2), avatarUrl: woman(68) },
  { notificationId: "n2", userId: "m0", title: "It's a match! 🎉", body: "Riya Kapoor accepted your request", type: "request_accepted", isRead: false, createdAt: days(2), avatarUrl: woman(9) },
  { notificationId: "n3", userId: "u1", title: "New message", body: "Aarav: see you Saturday!", type: "new_message", isRead: false, createdAt: mins(4), avatarUrl: man(32) },
  { notificationId: "n4", userId: "m0", title: "Someone viewed your profile", body: "Zoya Sheikh checked out your profile", type: "profile_view", isRead: true, createdAt: hrs(9), avatarUrl: woman(47) },
  { notificationId: "n5", userId: "u4", title: "Welcome to Duo 💍", body: "Complete your profile to get better matches", type: "system", isRead: true, createdAt: days(5) },
];

export const mockReports = [
  { reportId: "rep1", reporterId: "u1", reportedUserId: "m3", reason: "Inappropriate messages", createdAt: hrs(4) },
  { reportId: "rep2", reporterId: "u7", reportedUserId: "m5", reason: "Fake profile / catfishing", createdAt: hrs(18) },
  { reportId: "rep3", reporterId: "u10", reportedUserId: "m4", reason: "Harassment", createdAt: days(2) },
];

export const mockCalls = [
  { callId: "call1", callerId: "m0", calleeId: "u1", participants: ["m0", "u1"], type: "video", status: "ended", createdAt: hrs(8) },
  { callId: "call2", callerId: "u10", calleeId: "m0", participants: ["u10", "m0"], type: "audio", status: "missed", createdAt: days(1) },
];
