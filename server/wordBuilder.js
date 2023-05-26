import {getRandomInt} from "./util.js";
import {GAME_MODE} from "./constants.js";

const checkIfCollisionOrExist = (game, newWord, x, y) => {
    let result = false;

    //carpısmayı sonra ekle

    for(let i = 0; i < game.defaultWordList.length; i++) {
        if(game.defaultWordList[i].value === newWord.value) {
            return true;
        }
    }

    return result;
};

export default function wordBuilder(classicWords, languageWords, game, amount) {

    /*
      rastgele bir tane kelime çek
    * oyunun iöerisinde aynı kelime var mı bak
    * oyunun içindeki currentWordList'e ekle

    * */

    //ilk başta 5 tane kelime havuzu oluştur
    //koordinatları birbirlerine çakışmasın
    //tahmini boyutlama yap
    //1 karakter ortalama genişlik 2px

    //ekran boyutu 800 x 600

    for(let i = 1; i <= amount; i++) {

        switch (game.gameMode) {
            case GAME_MODE.CLASSIC:
                const x = getRandomInt(0, 800);
                const y = getRandomInt(0, 600);

                const newWord = classicWords[getRandomInt(0, classicWords.length - 1)];
                newWord.x = x;
                newWord.y = y;

                game.defaultWordList.push(newWord);
                if(!checkIfCollisionOrExist(game, newWord, x, y)) {



                } else {
                    //TODO:bak!
                }

                break;
            case GAME_MODE.LANGUAGE:

                break;
        }

    }

    game.currentWordList = game.defaultWordList;

}


export const pushWordToGame = async (classicWords, languageWords, game, amount) => {
    let i;
    for(i = 1; i <= amount; i++) {

        switch (game.gameMode) {
            case GAME_MODE.CLASSIC:
                const x = getRandomInt(0, 800);
                const y = getRandomInt(0, 600);

                const newWord = classicWords[getRandomInt(0, classicWords.length - 1)];
                newWord.x = x;
                newWord.y = y;

                game.currentWordList.push(newWord);
                break;
            case GAME_MODE.LANGUAGE:

                break;
        }

    }
}
