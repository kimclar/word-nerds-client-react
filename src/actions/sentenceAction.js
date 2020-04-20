export const findSentencesForWord = (word) => ({
    type: FIND_SENTENCES_FOR_WORD,
    word: word
})

export const FIND_SENTENCES_FOR_WORD = "FIND_SENTENCES_FOR_WORD"

export const deleteSentence = (sentenceId) => ({
    type: DELETE_SENTENCE,
    sentenceId: sentenceId
})
export const DELETE_SENTENCE = "DELETE_SENTENCE"

export const createSentence = (sentence) => ({
    type: CREATE_SENTENCE,
    newSentence: sentence
})
export const CREATE_SENTENCE = "CREATE_SENTENCE"

export const updateSentence = (sentenceId, sentence) => ({
    type: UPDATE_SENTENCE,
    updatedSentence: sentence
})

export const UPDATE_SENTENCE = "UPDATE_SENTENCE"
