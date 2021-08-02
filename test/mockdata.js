module.exports = {
    joinChallenge: {
        singleName: {
            identifier: 'A'
        },
        largeName: {
            identifier: 'ADFGHJK RTYUJBVCXJHGF RTYUKBGFDFGHJKJHGFD TYUIKGFDFGHJHGF ERTYJKJHGFDSXCVBNBVC UOYTYU RTYUGF TYUIUYGA ADFGHJK RTYUJBVCXJHGF RTYUKBGFDFGHJKJHGFD TYUIKGFDFGHJHGF ERTYJKJHGFDSXCVBNBVC UOYTYU RTYUGF TYUIUYGA ADFGHJK RTYUJBVCXJHGF RTYUKBGFDFGHJKJHGFD TYUIKGFDFGHJHGF ERTYJKJHGFDSXCVBNBVC UOYTYU RTYUGF TYUIUYGA'
        },
        invalidUserId: {
            identifier: 'https://www.gamify.com',
            userId: 'hello'
        }
    },
    updateChallenge: {
        singleName: {
            title: 'A'
        },
        largeName: {
            title: 'ADFGHJK RTYUJBVCXJHGF RTYUKBGFDFGHJKJHGFD TYUIKGFDFGHJHGF ERTYJKJHGFDSXCVBNBVC UOYTYU RTYUGF TYUIUYGA ADFGHJK RTYUJBVCXJHGF RTYUKBGFDFGHJKJHGFD TYUIKGFDFGHJHGF ERTYJKJHGFDSXCVBNBVC UOYTYU RTYUGF TYUIUYGA ADFGHJK RTYUJBVCXJHGF RTYUKBGFDFGHJKJHGFD TYUIKGFDFGHJHGF ERTYJKJHGFDSXCVBNBVC UOYTYU RTYUGF TYUIUYGA'
        },
        smallDescription: {
            title: 'Book Flight Tickets',
            description: 'Ensure Cheap Flight'
        },
        wrongToDoListId: {
            todoListId: 100
        },
        wrongDueDate: {
            title: 'Book Flight Tickets',
            todoListId: 1,
            dueDateTime: '2021/01/01 12:00'
        },
        legitProduct: {
            unitTest: true,
            title: 'Book Flight Tickets',
            todoListId: 1,
            description: 'Ensure Cheap Flights'
        }
    }
};
