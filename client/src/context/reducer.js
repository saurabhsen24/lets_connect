export const initialState = {
    user: null,
    token: null,
}

const reducer = (state, action) => {

    switch(action.type){
        case 'SET_USER': 
            return {
                ...state,
                user: action.user
            }
            
        case 'SET_TOKEN':
            return {
                ...state,
                token: action.token
            }

        case 'CLEAR':
            return {
                ...state,
                user: null,
                token: null
            }

        default: 
            return state;
    }
} 

export default reducer;