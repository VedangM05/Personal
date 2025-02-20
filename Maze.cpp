#include <iostream>
#include <vector>
#include <stack>
#include <queue>
#include <set>
#include <cstdlib>
#include <ctime>
#include <climits>
#include <unistd.h>  // For Mac/Linux compatibility

using namespace std;

// ANSI Color Codes for Mac/Linux
#define RESET_COLOR  "\033[0m"
#define BLUE_COLOR   "\033[34m"
#define GREEN_COLOR  "\033[32m"
#define RED_COLOR    "\033[31m"
#define YELLOW_COLOR "\033[33m"
#define WHITE_COLOR  "\033[37m"

// Function to Set Console Text Color (Mac/Linux)
void setConsoleColor(const string &color) {
    cout << color;
}

// Structure to Represent a Cell in the Maze
struct Cell {
    bool visited;
    bool walls[4];
    int distance;
    pair<int, int> parent;
    char pathSymbol;

    // Constructor
    Cell() : visited(false), distance(INT_MAX), parent(-1, -1), pathSymbol(' ') {
        walls[0] = walls[1] = walls[2] = walls[3] = true;
    }
};

// Maze Class Definition
class Maze {
public:
    Maze(int width, int height);
    void generateMaze();
    void displayMaze();
    void findShortestPath();

private:
    int width, height;
    pair<int, int> start, end;
    vector<vector<Cell>> grid;

    void removeWall(int x1, int y1, int x2, int y2);
    vector<pair<int, int>> getUnvisitedNeighbors(int x, int y);
    int heuristic(int x, int y, int goalX, int goalY);
};

// Maze Constructor
Maze::Maze(int w, int h) : width(w), height(h) {
    grid.resize(height, vector<Cell>(width));
    start = {0, 0};
    end = {width - 1, height - 1};
}

// Recursive Backtracking Maze Generation
void Maze::generateMaze() {
    stack<pair<int, int>> cellStack;
    int x = 0, y = 0;
    grid[y][x].visited = true;
    cellStack.push({x, y});

    while (!cellStack.empty()) {
        tie(x, y) = cellStack.top();
        vector<pair<int, int>> neighbors = getUnvisitedNeighbors(x, y);

        if (!neighbors.empty()) {
            auto [nx, ny] = neighbors[rand() % neighbors.size()];
            removeWall(x, y, nx, ny);
            grid[ny][nx].visited = true;
            cellStack.push({nx, ny});
        } else {
            cellStack.pop();
        }
    }
}

// Get Unvisited Neighbors of a Cell
vector<pair<int, int>> Maze::getUnvisitedNeighbors(int x, int y) {
    vector<pair<int, int>> neighbors;
    if (x > 0 && !grid[y][x - 1].visited) neighbors.push_back({x - 1, y});
    if (y > 0 && !grid[y - 1][x].visited) neighbors.push_back({x, y - 1});
    if (x < width - 1 && !grid[y][x + 1].visited) neighbors.push_back({x + 1, y});
    if (y < height - 1 && !grid[y + 1][x].visited) neighbors.push_back({x, y + 1});
    return neighbors;
}

// Remove Walls Between Two Cells
void Maze::removeWall(int x1, int y1, int x2, int y2) {
    if (x1 == x2) {
        if (y1 > y2) {
            grid[y1][x1].walls[0] = false;
            grid[y2][x2].walls[2] = false;
        } else {
            grid[y1][x1].walls[2] = false;
            grid[y2][x2].walls[0] = false;
        }
    } else if (y1 == y2) {
        if (x1 > x2) {
            grid[y1][x1].walls[3] = false;
            grid[y2][x2].walls[1] = false;
        } else {
            grid[y1][x1].walls[1] = false;
            grid[y2][x2].walls[3] = false;
        }
    }
}

// Display the Maze with Walls and Path
void Maze::displayMaze() {
    for (int y = 0; y < height; y++) {
        for (int x = 0; x < width; x++) {
            setConsoleColor(BLUE_COLOR);
            cout << (grid[y][x].walls[0] ? "+---" : "+   ");
        }
        cout << "+" << endl;

        for (int x = 0; x < width; x++) {
            setConsoleColor(BLUE_COLOR);
            cout << (grid[y][x].walls[3] ? "|" : " ");

            if (x == start.first && y == start.second) {
                setConsoleColor(YELLOW_COLOR);
                cout << " S ";
            } else if (x == end.first && y == end.second) {
                setConsoleColor(RED_COLOR);
                cout << " E ";
            } else if (grid[y][x].pathSymbol != ' ') {
                setConsoleColor(GREEN_COLOR);
                cout << " " << grid[y][x].pathSymbol << " ";
            } else {
                setConsoleColor(WHITE_COLOR);
                cout << "   ";
            }
        }
        setConsoleColor(BLUE_COLOR);
        cout << "|" << endl;
    }

    for (int x = 0; x < width; x++) {
        cout << "+---";
    }
    cout << "+" << endl;
    setConsoleColor(RESET_COLOR);
}

// Heuristic Function for A* Search
int Maze::heuristic(int x, int y, int goalX, int goalY) {
    return abs(x - goalX) + abs(y - goalY);
}

// Find the Shortest Path using A* Algorithm
void Maze::findShortestPath() {
    priority_queue<pair<int, pair<int, int>>, vector<pair<int, pair<int, int>>>, greater<>> queue;
    set<pair<int, int>> visited;
    grid[start.second][start.first].distance = 0;
    queue.push({0, start});

    int dx[4] = {0, 1, 0, -1};
    int dy[4] = {-1, 0, 1, 0};

    while (!queue.empty()) {
        auto [currentDistance, pos] = queue.top();
        auto [x, y] = pos;
        queue.pop();

        if (visited.count({x, y})) continue;
        visited.insert({x, y});
        if (x == end.first && y == end.second) break;

        for (int i = 0; i < 4; i++) {
            int nx = x + dx[i], ny = y + dy[i];
            if (nx >= 0 && ny >= 0 && nx < width && ny < height && !grid[y][x].walls[i]) {
                int newDist = currentDistance + 1;
                if (newDist < grid[ny][nx].distance) {
                    grid[ny][nx].distance = newDist;
                    grid[ny][nx].parent = {x, y};
                    queue.push({newDist + heuristic(nx, ny, end.first, end.second), {nx, ny}});
                }
            }
        }
    }

    int x = end.first, y = end.second;
    while (x != start.first || y != start.second) {
        auto [px, py] = grid[y][x].parent;
        grid[y][x].pathSymbol = (px == x) ? '|' : '-';
        x = px, y = py;
    }
}

void displayMenu() {
    cout << "1. Generate a maze" << endl;
    cout << "2. Generate another maze" << endl;
    cout << "3. Solve the maze" << endl;
    cout << "4. Exit" << endl;
    cout << "Enter your choice: ";
}

void askForMazeSize(int &width, int &height) {
    cout << "Enter the width of the maze: ";
    cin >> width;
    cout << "Enter the height of the maze: ";
    cin >> height;
}

int main() {
    srand(static_cast<unsigned>(time(0)));
    Maze maze(10, 10);
    bool mazeGenerated = false;

    while (true) {
        displayMenu();
        int choice;
        if (!(cin >> choice)) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "Invalid input. Please enter a valid integer." << endl;
            continue;
        }

        if (choice == 1 || choice == 2) {
            int width, height;
            askForMazeSize(width, height);
            maze = Maze(width, height);
            maze.generateMaze();
            maze.displayMaze();
            mazeGenerated = true;
        }
        else if (choice == 3) {
            if (!mazeGenerated) {
                cout << "Please generate a maze first." << endl;
            } else {
                maze.findShortestPath();
                maze.displayMaze();
            }
        }
        else if (choice == 4) {
            cout << "Exiting program. Goodbye!" << endl;
            break;
        }
        else {
            cout << "Invalid choice. Please select a valid option." << endl;
        }
    }

    return 0;
}
