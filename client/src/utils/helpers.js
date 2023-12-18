import icons from "./icons";

const { IoIosStar, IoIosStarOutline } = icons;


export const createSlug = (string) => (string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(" ")
    .join("-"));


export const formatMoney = number => Number(number.toFixed(1)).toLocaleString()


export const renderStarFromNumber = (number) => {
    if(!Number(number)) return 
    // 4 => [1,1,1,1,0]
    // 3 => [1,1,1,0,0]
    // 2 => [1,1,0,0,0]
    const stars = []
    for(let i = 0; i < +number; i++) stars.push(<IoIosStar key={i} color="orange"/>);
    for (let i = 5; i > +number; i--) stars.push(<IoIosStarOutline key={i} color="orange" />);

    // console.log(stars);
    return stars
}