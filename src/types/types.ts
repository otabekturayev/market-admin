export type ModulsType = "add" | "edit" | "";

export interface CategoryType {
  id: string;
  createdAt: string;
  updatedAt: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
}

export interface ReviewsType{
  id: string;
  createdAt: string;
  updatedAt: string;
  images: string;
  rate: number | string;
  userName: string;
  textUz: string;
  textEn: string;
  textRu: string;
}

export interface ProductsType {
    id: string;
    createdAt: string;
    updatedAt: string;
    titleUz: string;
    titleRu: string;
    titleEn: string;
    category: CategoryType
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
    titleUz: string;
    titleRu: string;
    titleEn: string;
    descriptionUz: string;
    descriptionRu: string;
    descriptionEn: string;
    days: number;
    price: number | undefined;
    travelTypeId: string;
    
  };

  export interface AttractionsType{
    id: string;
    createdAt: string;
    updatedAt: string;
    image: string;
    titleUz: string;
    titleRu: string;
    titleEn: string;
    textUz: string;
    textRu: string;
    textEn: string;
  };

  export interface AttractionsDataType extends AttractionsType {
    travel: TravelType;
  }

  export interface DaysType {
    id: string;
    createdAt: string;
    updatedAt: string;
    destinationUz: string;
    destinationRu: string;
    destinationEn: string;
    titleUz: string;
    titleRu: string;
    titleEn: string;
    image: string;
    textUz: string;
    textRu: string;
    textEn: string;
    long: number | string;
    lat: number | string;
    travelId: string;
  }
  
  export interface DataDaysType extends DaysType{
    travel: TravelType;
  }


  
  export interface ServicesType{
    id: string;
    createdAt: string;
    updatedAt: string;
    titleUz: string;
    titleRu: string;
    titleEn: string
  }

  export interface ArticlesType{
    id: string;
    createdAt: string;
    updatedAt: string;
    titleUz: string;
    titleRu: string;
    titleEn: string;
    descriptionUz: string;
    descriptionRu: string;
    descriptionEn: string;
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

  export interface SubTrivelIdeasType{
    id: string;
    createdAt: string;
    updatedAt: string;
    titleUz: string;
    titleRu: string;
    titleEn: string;
    descriptionUz: string;
    descriptionRu: string;
    descriptionEn: string;
    image: string;
  }

  export interface TRavelIdeasType{
    id: string;
    createdAt: string;
    updatedAt: string;
    titleUz: string;
    titleRu: string;
    titleEn: string;
    descriptionUz: string;
    descriptionRu: string;
    descriptionEn: string;
    subTitleUz: string;
    subTitleRu: string;
    subTitleEn: string;
    miniInfoUz: string;
    miniInfoRu: string;
    miniInfoEn: string;
    subDescriptionUz: string;
    subDescriptionRu: string;
    subDescriptionEn: string;
    image: string;
    subImage: string;
    subTravelIdeasId: string;
    subTravelIdeas: SubTrivelIdeasType;
  }


  export interface SubTravelType{
    id: string;
    createdAt: string;
    updatedAt: string;
    titleUz: string;
    titleRu: string;
    titleEn: string;
    descriptionUz: string;
    descriptionRu: string;
    descriptionEn: string;
    image: string;
  }

  
  
  
