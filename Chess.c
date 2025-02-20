#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#ifdef _WIN32
    #include <windows.h>
    #define SLEEP(ms) Sleep(ms)
#else
    #include <unistd.h>
    #define SLEEP(ms) usleep((ms) * 1000)
#endif

#define BOARD_SIZE 8

char board[BOARD_SIZE][BOARD_SIZE] = {
    {'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'},
    {'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'},
    {' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '},
    {' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '},
    {' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '},
    {' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '},
    {'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'},
    {'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'}
};

int currentPlayer = 1; // 1 for White, -1 for Black

void displayBoard() {
    system("clear || cls"); // Cross-platform clearing of console
    printf("  a b c d e f g h\n");
    for (int i = 0; i < BOARD_SIZE; i++) {
        printf("%d ", 8 - i);
        for (int j = 0; j < BOARD_SIZE; j++) {
            printf("%c ", board[i][j]);
        }
        printf("%d\n", 8 - i);
    }
    printf("  a b c d e f g h\n");
}

int isValidMove(int x1, int y1, int x2, int y2) {
    char piece = board[x1][y1];
    char target = board[x2][y2];
    if (piece == ' ' || (currentPlayer == 1 && piece >= 'a' && piece <= 'z') || (currentPlayer == -1 && piece >= 'A' && piece <= 'Z')) {
        return 0;
    }
    if (target != ' ' && ((currentPlayer == 1 && target >= 'A' && target <= 'Z') || (currentPlayer == -1 && target >= 'a' && target <= 'z'))) {
        return 0;
    }
    return 1; // Basic move validation (extend with piece rules)
}

void movePiece(int x1, int y1, int x2, int y2) {
    if (isValidMove(x1, y1, x2, y2)) {
        board[x2][y2] = board[x1][y1];
        board[x1][y1] = ' ';
        currentPlayer *= -1;
    } else {
        printf("Invalid move! Try again.\n");
        SLEEP(1000);
    }
}

void getInput() {
    char from[3], to[3];
    printf("%s's move (e.g., e2 e4): ", currentPlayer == 1 ? "White" : "Black");
    scanf("%s %s", from, to);
    int x1 = 8 - (from[1] - '0');
    int y1 = from[0] - 'a';
    int x2 = 8 - (to[1] - '0');
    int y2 = to[0] - 'a';
    movePiece(x1, y1, x2, y2);
}

int main() {
    while (1) {
        displayBoard();
        getInput();
    }
    return 0;
}
