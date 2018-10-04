FROM node:8
ADD lambda /newdirectory/lambda
ADD models /newdirectory/models
WORKDIR /newdirectory/lambda/custom
RUN npm install
RUN npm test
WORKDIR /
RUN npm run build-aws-resource