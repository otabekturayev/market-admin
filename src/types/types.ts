export type ModulsType = "add" | "edit" | "";

export interface LevelsType {
  id: string;
  createdAt: string;
  updatedAt: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
}

export interface TravelDesignersType {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  image: string;
  about: string;
}

export interface TravelTypesType {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    image: string;
  };
  export interface DaysType{
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    destination: string;
    text: string;
    latitude: number;
    longitude: number;
    travel: TravelType;
  };

  export interface TravelType{
    id: string;
    createdAt: string;
    updatedAt: string;
    image: string;
    title: string;
    description: string;
    days: number;
    price: string | number;
    travelTypeId: string;
  };

  export interface AttractionsType{
    id: string;
    createdAt: string;
    updatedAt: string;
    image: string;
    title: string;
    text: string;
  };

  export interface AttractionsDataType extends AttractionsType {
    travel: TravelType;
  }

  export interface DaysType {
    id: string;
    createdAt: string;
    updatedAt: string;
    destination: string;
    title: string;
    image: string;
    text: string;
    long: number | string;
    lat: number | string;
    travelId: string;
  }
  
  export interface DataDaysType extends DaysType{
    travel: TravelType;
  }

  export interface DataTravelType extends TravelType{
    travelDesigner: TravelDesignersType,
    travelType: TravelTypesType,
    levels: LevelsType[],
    attactions: AttractionsType[],
    day: DaysType[]
  }
  
  export interface ServicesType{
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
  }

  export interface DataServicesType extends ServicesType{
    levels: LevelsType[];
  }

  export interface ArticlesType{
    id: string;
    createdAt: string;
    updatedAt: string;
    titleUz: string;
    titleRu: string;
    titleEn: string;
    images: string;
  }

  export interface SubArticlesType{
    id: string;
    createdAt: string;
    updatedAt: string;
    titleUz: string;
    titleRu: string;
    titleEn: string;
    images: string;
    textUz: string;
    textRu: string;
    textEn: string;
    aboutImage: string;
    articleId: string;
    article: ArticlesType
  }

  export interface OperatorsType{
    id: string;
    createdAt: string;
    updatedAt: string;
    phone: string;
    email: string;
    workTime: string;
  }

  
  
  
