#include <stdio.h>
#include <sys/resource.h>
# include <stdlib.h>

int main() {
    struct rlimit rlim;
    rlim.rlim_cur = 0;
    rlim.rlim_max = 0;
    char *ptr = malloc;

    setrlimit(RLIMIT_DATA, &rlim);
    setrlimit(RLIMIT_STACK, &rlim);
    setrlimit(RLIMIT_CORE, &rlim);
    setrlimit(RLIMIT_AS, &rlim);
    setrlimit(RLIMIT_MEMLOCK, &rlim);
    setrlimit(RLIMIT_NPROC, &rlim);

    char *argv = malloc(20);
    argv = "malloc";
    scanf("%s", ptr);
    __asm__ (
   "mov %rax, 0\n"
   "ret"
    );
    

    printf("Hello, World!\nmalloc res == %s\n", argv);
    return 0;
}