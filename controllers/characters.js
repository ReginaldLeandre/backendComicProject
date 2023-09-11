const axios = require('axios');
const crypto = require('crypto');



/***************************************************************************************************
 *                                         Global Variables for API Access
 *                                                 
 ***************************************************************************************************/
const ts = 1;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BASE_URL = process.env.BASE_URL;



const concatenatedString = ts + PRIVATE_KEY + PUBLIC_KEY;


const md5Hash = crypto.createHash('md5').update(concatenatedString).digest('hex');

/**************************************************************************************************/

/***************************************************************************************************
 *                                             shuffling the results
 *                                            creating a random price
 * *************************************************************************************************/

// function randomizing(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]]; // Swap elements
//     }
// }

// console.log(md5Hash)


function generateRandomDollarValue() {
  const randomValue = Math.random() * 51 + 50;
  const roundedValue = Math.round(randomValue * 100) / 100;
  const formattedValue = `$${roundedValue.toFixed(2)}`;

  return formattedValue;
}

const randomDollarValue = generateRandomDollarValue();

const getMarvelCharacters = async (req,res) => {
    try{
        const response = await axios.get(`${BASE_URL}/characters?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${md5Hash}`, {
                    params: {
                      limit: 20
                    }});
                    // const characters = response.data.data.results;

                      console.log(response)

                    const characters = response.data.data.results.map(character => {
                        const characterId = character.id;
                        const firstImage = character.thumbnail && character.thumbnail.path
                          ? `${character.thumbnail.path}.${character.thumbnail.extension}`
                          : null;
                          return {
                            name: character.name,
                            id: characterId, //this id will help with the url 
                            image: firstImage 
                          };
                        });
                               
        
                    

        res.json(characters);
        
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            error: "Cannot Get Characters"
        });
    }
};


const searchComic = async (req, res) => {
  const { title } = req.query;
  try{
      const response = await axios.get(`${BASE_URL}/comics?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${md5Hash}`, {
                  params: {
                    limit: 20,
                    titleStartsWith: title
                  }});

  

      const comics = response.data.data.results.map(comic => {
          const comicId = comic.id;           
          const firstImage = comic.thumbnail && comic.thumbnail.path
            ? `${comic.thumbnail.path}.${comic.thumbnail.extension}`
            : null;
            return {
              title: comic.title,
              id: comicId,
              image: firstImage 
            };
          });
      
      res.json(comics);
      
  }
  catch(error){
      console.error(error);
      res.status(500).json({
          error: `Cannot Find Comics That Start With "${name}"` 
      });
  }
};



const searchCharacter = async (req, res) => {
    const { name } = req.query;
    try{
        const response = await axios.get(`${BASE_URL}/characters?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${md5Hash}`, {
                    params: {
                      limit: 20,
                      nameStartsWith: name
                    }});

    

        const characters = response.data.data.results.map(character => {
            const characterId = character.id;           
            const firstImage = character.thumbnail && character.thumbnail.path
              ? `${character.thumbnail.path}.${character.thumbnail.extension}`
              : null;
              return {
                name: character.name,
                id: characterId,
                image: firstImage 
              };
            });
        
        res.json(characters);
        
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            error: `Cannot Get Characters That Start With "${name}"` 
        });
    }
};


const showCharacter = async (req, res) => {
    try {
      const characterId = req.params.id;
      
      
      const characterResponse = await axios.get(`${BASE_URL}/characters/${characterId}?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${md5Hash}`);
      const characterData = characterResponse.data.data.results[0];
      
      const characterName = characterData.name;
      const characterDescription = characterData.description;
      const charId = characterData.id
      
      const characterImageURL = `${characterData.thumbnail.path}.${characterData.thumbnail.extension}`;
  
      
      const comicsURI = characterData.comics.collectionURI;
      const comicsResponse = await axios.get(`${comicsURI}?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${md5Hash}`, {
        params: {
          limit: 10
        }
      });
  
      const comicsData = comicsResponse.data.data.results;

      const comicPrice = randomDollarValue;
    
      const characterComics = comicsData.map(comic => ({
        title: comic.title,
        description: comic.description,
        id: comic.id,
        image: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
        price: randomDollarValue
      }));
  
      const characterInfo = {
        name: characterName,
        id: charId,
        description: characterDescription,
        image: characterImageURL, 
        comics: characterComics,
      };
  
      res.json(characterInfo);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Cannot Get Character Details"
      });
    }
  };


  const showComic = async (req, res) => {
      ///comics/{comicId}
    //collectionURI
    

    //example json
    // // "id": 1017603,
    // "name": "Spider-Gwen (Gwen Stacy)",
    // "description": "",
    // "modified": "2021-06-30T17:29:14-0400",
    // "thumbnail": {
    //   "path": "http://i.annihil.us/u/prod/marvel/i/mg/c/90/54edf8eb8f102",
    //   "extension": "jpg"
    //   }
      try{
        const comicId = req.params.id;

        const comicResponse = await axios.get(`${BASE_URL}/comics/${comicId}?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${md5Hash}`);

        const comicsData = comicResponse.data.data.results[0];
        const comictitle = comicsData.title
        const comicDescription = comicsData.description
        const comicBookId = comicsData.id
        const comicRelease = comicsData.modified;
        const comicImage = `${comicsData.thumbnail.path}.${comicsData.thumbnail.extension}`
        const comicCharactersURI = comicsData.characters.collectionURI;
        const comicPrice = randomDollarValue;
        

        const featuredCharacterResponse = await axios.get(`${comicCharactersURI}?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${md5Hash}`);
        
        const featuredCharacterData = featuredCharacterResponse.data.data.results;



        const featuredChar = featuredCharacterData.map(character => ({
          name: character.name,
          id: character.id,
          image: `${character.thumbnail.path}.${character.thumbnail.extension}`
        }));


        const comicBook = {
          title: comictitle,
          description: comicDescription,
          id: comicBookId,
          releaseDate: comicRelease,
          image: comicImage,
          price: randomDollarValue,
          featuredCharacters: featuredChar,

        }


        res.json(comicBook);

      } catch (error) {
        console.error(error);
        res.status(500).json({
          error: "Cannot Get Comic Book Details"
        });
  
          }    }



module.exports = {
    list: getMarvelCharacters,
    search: searchCharacter,
    searchComic,
    show: showCharacter,
    comic: showComic
};