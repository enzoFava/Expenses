echo "BUILD START"
python3.9 -m install -r requirements.txt
python3.9 manage.py migrate
python3.9 manage.py collecstatic --noinput --clear
echo "BUILD END"