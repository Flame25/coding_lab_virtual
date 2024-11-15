#include <stdio.h>

int main() {
    int num; 
    scanf("%d",&num);
    int count = 1; // This will keep track of the numbers to print

    // Outer loop for rows
    for (int i = 1; i <= num; i++) {
        // Inner loop for printing numbers in each row
        for (int j = 1; j <= i; j++) {
            printf("%d ",count);
        }
        printf("\n"); // Move to the next line after each row
    }

    return 0;
}

