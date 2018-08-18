echo "start dockerizing!"
echo "."
echo ".."
echo "..."

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

result=`docker image ls`
target=`echo $result | cut -d ' ' -f9`
docker rmi $target

docker build -t tiptap:v0.1 .
docker run -d -v /home/ec2-user/TipTap_Server/image:/app/tiptap/image -p 8080:8080 tiptap:v0.1

echo "."
echo "."
echo "."
echo "completed dockerizing!"
