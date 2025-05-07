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
  nameUz: string;
  nameRu: string;
  nameEn: string;
  email: string;
  image: string;
  aboutUz: string;
  aboutRu: string;
  aboutEn: string;
}

export interface ExprensType{
  id: string;
  createdAt: string;
  updatedAt: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  subTitleUz: string;
  subTitleRu: string;
  subTitleEn: string;
  image: string;
  descreptionUz: string;
  descreptionRu: string;
  descreptionEn: string;
}

export interface TravelTypesType {
    id: string;
    createdAt: string;
    updatedAt: string;
    titleUz: string;
    titleRu: string;
    titleEn: string;
    descreptionUz: string;
    descreptionRu: string;
    descreptionEn: string;
    tourTitleUz:string;
    tourTitleRu: string;
    tourTitleEn: string;
    travelIdeaId: string
    image: string;
    exprensId: string
    expren: ExprensType
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

  export interface DataTravelType extends TravelType{
    travelDesigner: TravelDesignersType,
    travelType: TravelTypesType,
    levels: LevelsType[],
    attactions: AttractionsType[],
    day: DaysType[]
    subTravels: string[]
  }
  
  export interface ServicesType{
    id: string;
    createdAt: string;
    updatedAt: string;
    titleUz: string;
    titleRu: string;
    titleEn: string
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

  
  
  
