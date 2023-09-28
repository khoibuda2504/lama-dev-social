export const handleImg = img => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  return PF + (img ?? "person/noAvatar.png")
}