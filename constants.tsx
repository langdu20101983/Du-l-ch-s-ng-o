
import { Destination, Region, TravelType } from './types';

export const DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Eiffel Tower',
    country: 'France',
    region: Region.EUROPE,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=1000',
    description: 'The iconic iron lattice tower on the Champ de Mars in Paris.',
    checkIns: 15400000
  },
  {
    id: '2',
    name: 'Ha Long Bay',
    country: 'Vietnam',
    region: Region.ASIA,
    type: TravelType.NATURE,
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1000',
    description: 'Stunning limestone karsts and isles in various shapes and sizes.',
    checkIns: 6200000
  },
  {
    id: '3',
    name: 'Machu Picchu',
    country: 'Peru',
    region: Region.AMERICAS,
    type: TravelType.ADVENTURE,
    image: 'https://images.unsplash.com/photo-1587590227264-0ac64ce63ce8?auto=format&fit=crop&q=80&w=1000',
    description: 'The 15th-century Inca citadel located in the Eastern Cordillera of southern Peru.',
    checkIns: 1500000
  },
  {
    id: '4',
    name: 'Santorini',
    country: 'Greece',
    region: Region.EUROPE,
    type: TravelType.RELAXATION,
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=1000',
    description: 'Famous for its stunning sunsets and white-washed buildings overlooking the Aegean Sea.',
    checkIns: 3800000
  },
  {
    id: '5',
    name: 'Kyoto Temples',
    country: 'Japan',
    region: Region.ASIA,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000',
    description: 'Beautiful historic temples, traditional tea houses, and cherry blossoms.',
    checkIns: 4100000
  },
  {
    id: '6',
    name: 'Great Barrier Reef',
    country: 'Australia',
    region: Region.OCEANIA,
    type: TravelType.NATURE,
    image: 'https://images.unsplash.com/photo-1582967702047-1110d188c148?auto=format&fit=crop&q=80&w=1000',
    description: 'The world\'s largest coral reef system, located in the Coral Sea off the coast of Queensland.',
    checkIns: 2000000
  },
  {
    id: '7',
    name: 'Pyramids of Giza',
    country: 'Egypt',
    region: Region.AFRICA,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&q=80&w=1000',
    description: 'The oldest and only surviving member of the Seven Wonders of the Ancient World.',
    checkIns: 14700000
  },
  {
    id: '8',
    name: 'Times Square',
    country: 'USA',
    region: Region.AMERICAS,
    type: TravelType.URBAN,
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7a56?auto=format&fit=crop&q=80&w=1000',
    description: 'A major commercial intersection, tourist destination, entertainment center in Midtown Manhattan.',
    checkIns: 50000000
  },
  {
    id: '9',
    name: 'Bana Hills',
    country: 'Vietnam',
    region: Region.ASIA,
    type: TravelType.URBAN,
    image: 'https://images.unsplash.com/photo-1559592413-7cee70af4541?auto=format&fit=crop&q=80&w=1000',
    description: 'Famous mountain resort with the Golden Bridge held by giant stone hands.',
    checkIns: 5400000
  },
  {
    id: '10',
    name: 'Colosseum',
    country: 'Italy',
    region: Region.EUROPE,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1000',
    description: 'An oval amphitheatre in the centre of the city of Rome, Italy.',
    checkIns: 7000000
  },
  {
    id: '11',
    name: 'Taj Mahal',
    country: 'India',
    region: Region.ASIA,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1000',
    description: 'An ivory-white marble mausoleum on the south bank of the Yamuna river.',
    checkIns: 8000000
  },
  {
    id: '12',
    name: 'Petra',
    country: 'Jordan',
    region: Region.ASIA,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?auto=format&fit=crop&q=80&w=1000',
    description: 'A historic and archaeological city in southern Jordan, famous for its rock-cut architecture.',
    checkIns: 1100000
  },
  {
    id: '13',
    name: 'Christ the Redeemer',
    country: 'Brazil',
    region: Region.AMERICAS,
    type: TravelType.URBAN,
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1000',
    description: 'An Art Deco statue of Jesus Christ in Rio de Janeiro, Brazil.',
    checkIns: 2000000
  },
  {
    id: '14',
    name: 'Angkor Wat',
    country: 'Cambodia',
    region: Region.ASIA,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=1000',
    description: 'A temple complex in Cambodia and the largest religious monument in the world.',
    checkIns: 2500000
  },
  {
    id: '15',
    name: 'Grand Canyon',
    country: 'USA',
    region: Region.AMERICAS,
    type: TravelType.NATURE,
    image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&q=80&w=1000',
    description: 'A steep-sided canyon carved by the Colorado River in Arizona, United States.',
    checkIns: 5900000
  },
  {
    id: '16',
    name: 'Burj Khalifa',
    country: 'UAE',
    region: Region.ASIA,
    type: TravelType.URBAN,
    image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80&w=1000',
    description: 'The tallest structure and building in the world since its topping out in 2009.',
    checkIns: 17000000
  },
  {
    id: '17',
    name: 'Swiss Alps',
    country: 'Switzerland',
    region: Region.EUROPE,
    type: TravelType.ADVENTURE,
    image: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80&w=1000',
    description: 'A major mountain range of Europe, spanning several countries including Switzerland.',
    checkIns: 4500000
  },
  {
    id: '18',
    name: 'Venice Canals',
    country: 'Italy',
    region: Region.EUROPE,
    type: TravelType.RELAXATION,
    image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80&w=1000',
    description: 'A city built on more than 100 small islands in a lagoon in the Adriatic Sea.',
    checkIns: 5500000
  },
  {
    id: '19',
    name: 'Table Mountain',
    country: 'South Africa',
    region: Region.AFRICA,
    type: TravelType.NATURE,
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=1000',
    description: 'A flat-topped mountain forming a prominent landmark overlooking the city of Cape Town.',
    checkIns: 4200000
  },
  {
    id: '20',
    name: 'Mount Fuji',
    country: 'Japan',
    region: Region.ASIA,
    type: TravelType.NATURE,
    image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&q=80&w=1000',
    description: 'An active stratovolcano that is the highest mountain in Japan.',
    checkIns: 3500000
  },
  {
    id: '21',
    name: 'Big Ben',
    country: 'United Kingdom',
    region: Region.EUROPE,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&q=80&w=1000',
    description: 'The nickname for the Great Bell of the striking clock at the north end of the Palace of Westminster.',
    checkIns: 6000000
  },
  {
    id: '22',
    name: 'Great Wall of China',
    country: 'China',
    region: Region.ASIA,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=1000',
    description: 'A series of fortifications that were built across the historical northern borders of ancient Chinese states.',
    checkIns: 10000000
  },
  {
    id: '23',
    name: 'Sydney Opera House',
    country: 'Australia',
    region: Region.OCEANIA,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1523413363574-c3c444a1183e?auto=format&fit=crop&q=80&w=1000',
    description: 'A multi-venue performing arts centre in Sydney, Australia.',
    checkIns: 8200000
  },
  {
    id: '24',
    name: 'Statue of Liberty',
    country: 'USA',
    region: Region.AMERICAS,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&q=80&w=1000',
    description: 'A colossal neoclassical sculpture on Liberty Island in New York Harbor.',
    checkIns: 4300000
  },
  {
    id: '25',
    name: 'Victoria Falls',
    country: 'Zambia',
    region: Region.AFRICA,
    type: TravelType.NATURE,
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1000',
    description: 'The largest waterfall in the world, based on its combined width of 1,708 meters.',
    checkIns: 1000000
  },
  {
    id: '26',
    name: 'Stonehenge',
    country: 'United Kingdom',
    region: Region.EUROPE,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1599110906885-b02446a0ba9f?auto=format&fit=crop&q=80&w=1000',
    description: 'A prehistoric monument in Wiltshire, England, consisting of a ring of standing stones.',
    checkIns: 1600000
  },
  {
    id: '27',
    name: 'Yosemite National Park',
    country: 'USA',
    region: Region.AMERICAS,
    type: TravelType.NATURE,
    image: 'https://images.unsplash.com/photo-1533496197514-4a56c9a2886c?auto=format&fit=crop&q=80&w=1000',
    description: 'Known for its giant, ancient sequoia trees, and for Tunnel View, the iconic vista of towering Bridalveil Fall.',
    checkIns: 4400000
  },
  {
    id: '28',
    name: 'Chichen Itza',
    country: 'Mexico',
    region: Region.AMERICAS,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1518638153282-9c5c4e9411fa?auto=format&fit=crop&q=80&w=1000',
    description: 'A complex of Mayan ruins on Mexico\'s Yucatán Peninsula.',
    checkIns: 2600000
  },
  {
    id: '29',
    name: 'Borobudur Temple',
    country: 'Indonesia',
    region: Region.ASIA,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80&w=1000',
    description: 'The world\'s largest Buddhist temple, located in Magelang, Central Java.',
    checkIns: 3300000
  },
  {
    id: '30',
    name: 'Neuschwanstein Castle',
    country: 'Germany',
    region: Region.EUROPE,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?auto=format&fit=crop&q=80&w=1000',
    description: 'The fairytale castle of King Ludwig II, located in the Bavarian Alps.',
    checkIns: 1400000
  },
  {
    id: '31',
    name: 'Sagrada Familia',
    country: 'Spain',
    region: Region.EUROPE,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1583778175782-d1d711994270?auto=format&fit=crop&q=80&w=1000',
    description: 'Gaudí’s unfinished masterpiece and an iconic symbol of Barcelona.',
    checkIns: 4700000
  },
  {
    id: '32',
    name: 'Dead Sea',
    country: 'Jordan',
    region: Region.ASIA,
    type: TravelType.NATURE,
    image: 'https://images.unsplash.com/photo-1563214589-943e1d1544a4?auto=format&fit=crop&q=80&w=1000',
    description: 'A salt lake bordered by Jordan to the east and Israel and the West Bank to the west.',
    checkIns: 1200000
  },
  {
    id: '33',
    name: 'Blue Lagoon',
    country: 'Iceland',
    region: Region.EUROPE,
    type: TravelType.RELAXATION,
    image: 'https://images.unsplash.com/photo-1520116468816-95b69f847357?auto=format&fit=crop&q=80&w=1000',
    description: 'A geothermal spa found in a lava field near Grindavík on the Reykjanes Peninsula.',
    checkIns: 1300000
  },
  {
    id: '34',
    name: 'Maldives',
    country: 'Maldives',
    region: Region.ASIA,
    type: TravelType.RELAXATION,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1000',
    description: 'Pristine white sand beaches and luxurious overwater bungalows.',
    checkIns: 1700000
  },
  {
    id: '35',
    name: 'Serengeti',
    country: 'Tanzania',
    region: Region.AFRICA,
    type: TravelType.NATURE,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1000',
    description: 'Famous for its massive annual migration of wildebeest and zebra.',
    checkIns: 500000
  },
  {
    id: '36',
    name: 'Mount Everest Base Camp',
    country: 'Nepal',
    region: Region.ASIA,
    type: TravelType.ADVENTURE,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1000',
    description: 'The gateway to the roof of the world for mountaineers and trekkers.',
    checkIns: 40000
  },
  {
    id: '37',
    name: 'Antelope Canyon',
    country: 'USA',
    region: Region.AMERICAS,
    type: TravelType.NATURE,
    image: 'https://images.unsplash.com/photo-1499195333224-3ce974eecfb4?auto=format&fit=crop&q=80&w=1000',
    description: 'A slot canyon in the American Southwest, on Navajo land east of Page, Arizona.',
    checkIns: 1000000
  },
  {
    id: '38',
    name: 'Forbidden City',
    country: 'China',
    region: Region.ASIA,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1545153997-4286663f2780?auto=format&fit=crop&q=80&w=1000',
    description: 'The former Chinese imperial palace from the Ming dynasty to the end of the Qing dynasty.',
    checkIns: 14000000
  },
  {
    id: '39',
    name: 'Golden Gate Bridge',
    country: 'USA',
    region: Region.AMERICAS,
    type: TravelType.URBAN,
    image: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=1000',
    description: 'A suspension bridge spanning the Golden Gate, the opening of the San Francisco Bay.',
    checkIns: 10000000
  },
  {
    id: '40',
    name: 'Louvre Museum',
    country: 'France',
    region: Region.EUROPE,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000',
    description: 'The world\'s largest art museum and a historic monument in Paris.',
    checkIns: 9600000
  },
  {
    id: '41',
    name: 'Acropolis of Athens',
    country: 'Greece',
    region: Region.EUROPE,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?auto=format&fit=crop&q=80&w=1000',
    description: 'An ancient citadel located on a rocky outcrop above the city of Athens.',
    checkIns: 3000000
  },
  {
    id: '42',
    name: 'Mount Kilimanjaro',
    country: 'Tanzania',
    region: Region.AFRICA,
    type: TravelType.ADVENTURE,
    image: 'https://images.unsplash.com/photo-1589553416260-178fa95ee1f7?auto=format&fit=crop&q=80&w=1000',
    description: 'A dormant volcano in Tanzania and the highest mountain in Africa.',
    checkIns: 50000
  },
  {
    id: '43',
    name: 'Galapagos Islands',
    country: 'Ecuador',
    region: Region.AMERICAS,
    type: TravelType.NATURE,
    image: 'https://images.unsplash.com/photo-1551221443-4f9642055104?auto=format&fit=crop&q=80&w=1000',
    description: 'An archipelago of volcanic islands in the Pacific Ocean, famous for unique wildlife.',
    checkIns: 270000
  },
  {
    id: '44',
    name: 'Great Sphinx',
    country: 'Egypt',
    region: Region.AFRICA,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&q=80&w=1000',
    description: 'A limestone statue of a reclining sphinx, a mythical creature with the head of a human.',
    checkIns: 12000000
  },
  {
    id: '45',
    name: 'Mount Cook',
    country: 'New Zealand',
    region: Region.OCEANIA,
    type: TravelType.NATURE,
    image: 'https://images.unsplash.com/photo-1469521669194-babc95018356?auto=format&fit=crop&q=80&w=1000',
    description: 'The highest mountain in New Zealand, located in the Southern Alps.',
    checkIns: 1000000
  },
  {
    id: '46',
    name: 'Cappadocia',
    country: 'Turkey',
    region: Region.ASIA,
    type: TravelType.ADVENTURE,
    image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=1000',
    description: 'Known for its unique "fairy chimneys" and hot air balloon rides at sunrise.',
    checkIns: 3800000
  },
  {
    id: '47',
    name: 'Alhambra',
    country: 'Spain',
    region: Region.EUROPE,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1527030280862-64139fba04ca?auto=format&fit=crop&q=80&w=1000',
    description: 'A palace and fortress complex located in Granada, Andalusia, Spain.',
    checkIns: 2700000
  },
  {
    id: '48',
    name: 'Iguazu Falls',
    country: 'Argentina',
    region: Region.AMERICAS,
    type: TravelType.NATURE,
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&q=80&w=1000',
    description: 'Waterfalls of the Iguazu River on the border of the Argentine province of Misiones.',
    checkIns: 1500000
  },
  {
    id: '49',
    name: 'Buckingham Palace',
    country: 'United Kingdom',
    region: Region.EUROPE,
    type: TravelType.URBAN,
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&q=80&w=1000',
    description: 'The London residence and administrative headquarters of the monarch of the United Kingdom.',
    checkIns: 5000000
  },
  {
    id: '50',
    name: 'Marina Bay Sands',
    country: 'Singapore',
    region: Region.ASIA,
    type: TravelType.URBAN,
    image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&q=80&w=1000',
    description: 'An integrated resort fronting Marina Bay in Singapore, known for its rooftop infinity pool.',
    checkIns: 12000000
  },
  {
    id: '51',
    name: 'Banff National Park',
    country: 'Canada',
    region: Region.AMERICAS,
    type: TravelType.NATURE,
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=80&w=1000',
    description: 'Canada\'s oldest national park, located in the Alberta Rockies.',
    checkIns: 4100000
  },
  {
    id: '52',
    name: 'Lofoten Islands',
    country: 'Norway',
    region: Region.EUROPE,
    type: TravelType.ADVENTURE,
    image: 'https://images.unsplash.com/photo-1534008843788-f222956f9163?auto=format&fit=crop&q=80&w=1000',
    description: 'Known for its distinctive scenery with dramatic mountains and peaks, open sea and sheltered bays.',
    checkIns: 1000000
  },
  {
    id: '53',
    name: 'Marrakech Medina',
    country: 'Morocco',
    region: Region.AFRICA,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1539020290141-9449bc96e495?auto=format&fit=crop&q=80&w=1000',
    description: 'A vibrant UNESCO World Heritage Site with bustling souks and historical riads.',
    checkIns: 3000000
  },
  {
    id: '54',
    name: 'Phi Phi Islands',
    country: 'Thailand',
    region: Region.ASIA,
    type: TravelType.RELAXATION,
    image: 'https://images.unsplash.com/photo-1528184039930-bc9a44049833?auto=format&fit=crop&q=80&w=1000',
    description: 'An island group in Thailand, between the large island of Phuket and the Straits of Malacca.',
    checkIns: 2000000
  },
  {
    id: '55',
    name: 'The Twelve Apostles',
    country: 'Australia',
    region: Region.OCEANIA,
    type: TravelType.NATURE,
    image: 'https://images.unsplash.com/photo-1494233892892-885adb9a2f50?auto=format&fit=crop&q=80&w=1000',
    description: 'A collection of limestone stacks off the shore of Port Campbell National Park.',
    checkIns: 1200000
  },
  {
    id: '56',
    name: 'Salar de Uyuni',
    country: 'Bolivia',
    region: Region.AMERICAS,
    type: TravelType.ADVENTURE,
    image: 'https://images.unsplash.com/photo-1543784534-716497f3b895?auto=format&fit=crop&q=80&w=1000',
    description: 'The world\'s largest salt flat, creating a mirror effect during the rainy season.',
    checkIns: 300000
  },
  {
    id: '57',
    name: 'Hagia Sophia',
    country: 'Turkey',
    region: Region.ASIA,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&q=80&w=1000',
    description: 'A monument of architectural brilliance in Istanbul, originally a cathedral, then a mosque.',
    checkIns: 3500000
  },
  {
    id: '58',
    name: 'Milford Sound',
    country: 'New Zealand',
    region: Region.OCEANIA,
    type: TravelType.NATURE,
    image: 'https://images.unsplash.com/photo-1448518340475-e3c680e9b4be?auto=format&fit=crop&q=80&w=1000',
    description: 'A fjord in the southwest of New Zealand\'s South Island, known for towering Mitre Peak.',
    checkIns: 800000
  },
  {
    id: '59',
    name: 'Sheikh Zayed Mosque',
    country: 'UAE',
    region: Region.ASIA,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1000',
    description: 'The largest mosque in the country, it is a key place of worship for Friday gathering and Eid prayers.',
    checkIns: 5000000
  },
  {
    id: '60',
    name: 'Uluru',
    country: 'Australia',
    region: Region.OCEANIA,
    type: TravelType.CULTURAL,
    image: 'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?auto=format&fit=crop&q=80&w=1000',
    description: 'A massive sandstone monolith in the heart of the Northern Territory\'s Red Centre.',
    checkIns: 300000
  }
];
