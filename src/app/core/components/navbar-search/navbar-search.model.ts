export interface SearchItem {
  name: string;
  icon: string;
  url: string;
}

export interface SearchSection {
  title: string;
  items: SearchItem[];
}

export interface SearchData {
  sections: SearchSection[];
}
