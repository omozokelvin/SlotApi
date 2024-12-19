# This script is a helper to run tests in a service or controller file
# Usage: ./run-test.sh <entity> <type>
# Example: ./run-test.sh user controller
# Example: ./run-test.sh user service

ENTITY=$1
TYPE=$2

if [ "$TYPE" = "controller" ]; then
  COMMAND="npm run test -- --testPathPattern='src/.*/$ENTITY.controller.spec.ts'"
elif [ "$TYPE" = "service" ]; then
  COMMAND="npm run test -- --testPathPattern='src/.*/$ENTITY.service.spec.ts'"
else
  echo "Invalid type specified. Use 'controller' or 'service'."
  exit 1
fi

echo "Running command: $COMMAND"
eval $COMMAND